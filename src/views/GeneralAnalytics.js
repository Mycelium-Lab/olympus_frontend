import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'
import moment from 'moment'

import { setMessage } from '../redux/actions/messageActions'
import { useDispatch } from 'react-redux'

import { Skeleton } from '@mui/material'

import { getPairsInfoFunction, mapPairs } from '../dataFetch/pairs'
import {
    chartConfig,
    methodPropsChartConfigs,
    stakingLength,
    bondsAndStakingLength,
    timeframesConfig,
    createCrosshairConfig,
    baseGranularityUnix,
} from '../util/config'
import {
    getMappedScData,
    trimDataSetEnd,
    mergeObjectsArrays,
    mergeObjectsArraysOverrideTime,
} from '../util/dataTranformations'

import { ReactComponent as LoadingSpinner } from '../images/vectors/spinner.svg'

import '../styles/main.scss'
import '../styles/generalAnalytics.scss'

const fillChart = (chart, method, mappedData, scSeries) =>
    methodPropsChartConfigs[method].setChart(chart, mappedData, scSeries)

const defaultTimeframe = localStorage.getItem('ga_default_timeframe')

const errorMessage = (refreshRateSeconds) => ({
    severity: 3,
    text: `Refresh request failed, trying again in ${refreshRateSeconds} seconds.`,
})

export default function GeneralAnalytics() {
    const dispatch = useDispatch()

    const refreshRateSeconds = 30
    const nCharts = 2

    const [refs, setRefs] = useState(
        Array.from(Array(nCharts).keys()).map((_) => createRef())
    )

    const [key, setKey] = useState(null)
    const [method, setMethod] = useState(0)
    const [currentDefaultTimeframe, setCurrentDefaultTimeframe] = useState(
        defaultTimeframe ? parseInt(defaultTimeframe) : null
    )
    const [timeframe, setTimeframe] = useState(currentDefaultTimeframe ?? 0)

    const [isGlobalLoading, setIsGlobalLoading] = useState(false)
    const [isPartialLoading, setIsPartialLoading] = useState(false)

    const [updateInterval, setUpdateInterval] = useState(null)

    const changeMethod = (e) => {
        const newMethod = e.currentTarget.value
        if (newMethod !== method) {
            updateRefs()
            setMethod(parseInt(newMethod))
        }
    }

    const changeTimeframe = (newTimeframe) => {
        if (timeframe !== newTimeframe) {
            updateRefs()
            setTimeframe(newTimeframe)
        }
    }

    const updateRefs = () => {
        setKey(v4())
        const newRefs = Array.from(Array(nCharts).keys()).map((_) =>
            createRef()
        )
        setRefs(newRefs)
    }

    useEffect(async () => {
        const timeVisibleConfig = {
            timeScale: {
                ...chartConfig.timeScale,
                timeVisible: timeframe > 0,
            },
        }

        const charts = refs.map((_, i) => {
            if (i === 1) {
                return createChart(refs[i].current, {
                    ...chartConfig,
                    ...timeVisibleConfig,
                    height: 200,
                })
            }
            return createChart(refs[i].current, {
                ...chartConfig,
                ...timeVisibleConfig,
            })
        })

        // main data (dex price + volume)

        let pairs, pairsMapped, scMapped

        let { fetchBackDelta, initialTimestamp, endTimestamp, intervalDiff } =
            timeframesConfig[timeframe]

        const getPairsInfo = getPairsInfoFunction(timeframe) // get a corresponding fetch function with respect to timeframe

        let promises = [
            getPairsInfo(initialTimestamp, endTimestamp, 'OHM', 'DAI'),
            getMappedScData(
                initialTimestamp,
                endTimestamp,
                method,
                timeframe,
                intervalDiff,
                true
            ),
        ]

        setIsGlobalLoading(true)
        const resolvedDataFetch = await Promise.all(promises)
        setIsGlobalLoading(false)

        pairs = resolvedDataFetch[0]
        pairsMapped = trimDataSetEnd(mapPairs(pairs))
        scMapped = resolvedDataFetch[1]

        const candleSeries = charts[0].addCandlestickSeries({
            upColor: 'rgb(37,166,154)',
            downColor: 'rgb(239,83,80)',
            borderVisible: false,
            wickVisible: true,
            borderColor: '#000000',
            wickUpColor: 'rgb(37,166,154)',
            wickDownColor: 'rgb(239,83,80)',
        })

        candleSeries.setData(pairsMapped.priceCandles)

        const volumeHistConfig = {
            base: 0,
            priceFormat: {
                type: 'volume',
            },
            overlay: true,
            scaleMargins: {
                top: 0.6,
                bottom: 0.04,
            },
        }

        const volumeUpHist = charts[0].addHistogramSeries({
            ...volumeHistConfig,
            color: 'rgb(147,210,204)',
        })

        const volumeDownHist = charts[0].addHistogramSeries({
            ...volumeHistConfig,
            color: 'rgb(247,169,167)',
        })

        volumeUpHist.setData(pairsMapped.volumeUp)
        volumeDownHist.setData(pairsMapped.volumeDown)

        // additional data from smart contracts

        let scSeries = fillChart(charts[charts.length - 1], method, scMapped)

        // crosshair

        let isCrosshairMoving = false
        let isCrosshairActiveArr = Array(refs.length).fill(false)

        charts.forEach((chart, idx) => {
            chart.subscribeCrosshairMove((param) => {
                if (!param.point) return
                if (!param.time) return
                if (isCrosshairMoving) return

                isCrosshairMoving = true
                charts
                    .slice(0, idx)
                    .concat(charts.slice(idx + 1))
                    .forEach((c) => c.moveCrosshair(param.point))
                isCrosshairMoving = false
            })
        })

        refs.forEach((r, i) => {
            r.current.addEventListener('mousemove', () => {
                if (isCrosshairActiveArr[i]) return
                isCrosshairActiveArr.forEach((e, idx) => {
                    if (i == idx) e = true
                    else e = false

                    charts[idx].applyOptions(createCrosshairConfig(e))
                })
            })
        })

        // fetching past data

        let chartNeedsUpdate = false
        let els = Array.from(Array(nCharts).keys()).map((_) => null)

        charts.forEach((chart, idx) => {
            chart
                .timeScale()
                .subscribeVisibleLogicalRangeChange(async (range) => {
                    charts
                        .slice(0, idx)
                        .concat(charts.slice(idx + 1))
                        .forEach((c) =>
                            c.timeScale().setVisibleLogicalRange(range)
                        )

                    if (range.from < 0 && !chartNeedsUpdate) {
                        chartNeedsUpdate = true
                        endTimestamp = initialTimestamp
                        initialTimestamp =
                            initialTimestamp -
                            fetchBackDelta * baseGranularityUnix

                        // update price and volume chart
                        setIsPartialLoading(true)

                        const newPairsData = await getPairsInfo(
                            initialTimestamp,
                            endTimestamp,
                            'OHM',
                            'DAI'
                        )

                        const newPairsMapped = mapPairs(newPairsData)

                        if (
                            newPairsMapped.priceCandles.length > 0 &&
                            newPairsMapped.volumeUp.length > 0 &&
                            newPairsMapped.volumeDown.length > 0
                        ) {
                            pairsMapped = mergeObjectsArrays(
                                pairsMapped,
                                newPairsMapped
                            )

                            // fetch sc chart data
                            const newScMapped = await getMappedScData(
                                initialTimestamp,
                                endTimestamp,
                                method,
                                timeframe,
                                intervalDiff,
                                false
                            )

                            scMapped = mergeObjectsArrays(scMapped, newScMapped)

                            // update both

                            candleSeries.setData(pairsMapped.priceCandles)
                            volumeUpHist.setData(pairsMapped.volumeUp)
                            volumeDownHist.setData(pairsMapped.volumeDown)

                            scSeries = fillChart(
                                charts[charts.length - 1],
                                method,
                                scMapped,
                                scSeries
                            )

                            chartNeedsUpdate = false
                            setIsPartialLoading(false)
                        }
                    }
                })

            if (refs.length === nCharts) {
                const ro = new ResizeObserver((entries) => {
                    const cr = entries[0].contentRect
                    chart.resize(cr.width, cr.height)
                })

                ro.observe(refs[idx].current)
            }

            els[idx] = document.addEventListener('resize', () => {
                chart.resize(
                    refs[idx].current.innerWidth,
                    refs[idx].current.innerHeight
                )
            })
        })

        // updating charts

        if (updateInterval) {
            clearInterval(updateInterval)
        }

        setUpdateInterval(
            setInterval(async () => {
                try {
                    const startDate = moment().utc().startOf('day').unix()
                    const endDate = moment().utc().endOf('day').unix()
                    const updatePromises = await Promise.all([
                        getPairsInfo(startDate, endDate, 'OHM', 'DAI'),
                        getMappedScData(
                            startDate,
                            endDate,
                            method,
                            timeframe,
                            intervalDiff,
                            false
                        ),
                    ])

                    const updatePairsMapped = mapPairs(updatePromises[0])
                    const updateScMapped = updatePromises[1]

                    pairsMapped = mergeObjectsArraysOverrideTime(
                        pairsMapped,
                        trimDataSetEnd(updatePairsMapped)
                    )
                    scMapped = mergeObjectsArraysOverrideTime(
                        scMapped,
                        trimDataSetEnd(updateScMapped)
                    )

                    candleSeries.setData(pairsMapped.priceCandles)
                    volumeUpHist.setData(pairsMapped.volumeUp)
                    volumeDownHist.setData(pairsMapped.volumeDown)

                    scSeries = fillChart(
                        charts[charts.length - 1],
                        method,
                        scMapped,
                        scSeries
                    )
                } catch (e) {
                    dispatch(setMessage(errorMessage(refreshRateSeconds)))
                }
            }, refreshRateSeconds * 1000)
        )

        return () => {
            if (updateInterval) {
                clearInterval(updateInterval)
            }
            charts.forEach((c) => c.remove)
            els.forEach((el) => {
                if (el) document.removeEventListener('resize', el)
            })
        }
    }, [method, timeframe])

    return (
        <div className="main-content general-analytics-view">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h5 className="page-title mb-0 font-size-18">
                                General Analytics
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-9">
                                        <div className="card card-body">
                                            <div
                                                key={key}
                                                className="dex-container"
                                            >
                                                <div className="dex-price-outer">
                                                    {isGlobalLoading && (
                                                        <Skeleton
                                                            style={{
                                                                width: 'inherit',
                                                                position:
                                                                    'absolute',
                                                                zIndex: 5,
                                                                borderRadius: 4,
                                                            }}
                                                            variant="rect"
                                                            animation="wave"
                                                            width="100%"
                                                            height={370}
                                                        />
                                                    )}
                                                    <span className="dex-price-title">
                                                        SushiSwap OHM/DAI Price
                                                        & Volume,{' '}
                                                        {
                                                            timeframesConfig[
                                                                timeframe
                                                            ].name
                                                        }
                                                    </span>
                                                    {isPartialLoading && (
                                                        <div className="loading-spinner">
                                                            <LoadingSpinner />
                                                        </div>
                                                    )}
                                                    <div
                                                        style={
                                                            isGlobalLoading
                                                                ? { zIndex: -1 }
                                                                : {}
                                                        }
                                                        className="ga-chart dex-price"
                                                        ref={refs[0]}
                                                    ></div>
                                                </div>
                                                <div className="staking-volume-outer">
                                                    {isGlobalLoading && (
                                                        <Skeleton
                                                            style={{
                                                                width: 'inherit',
                                                                position:
                                                                    'absolute',
                                                                zIndex: 5,
                                                                borderRadius: 4,
                                                            }}
                                                            variant="rect"
                                                            animation="wave"
                                                            width="100%"
                                                            height={200}
                                                        />
                                                    )}
                                                    <span className="staking-volume-title">
                                                        {`${methodPropsChartConfigs[method].title}, ${timeframesConfig[timeframe].name}`}
                                                    </span>
                                                    {isPartialLoading && (
                                                        <div className="loading-spinner">
                                                            <LoadingSpinner />
                                                        </div>
                                                    )}
                                                    <div
                                                        style={
                                                            isGlobalLoading
                                                                ? { zIndex: -1 }
                                                                : {}
                                                        }
                                                        className="ga-chart staking-volume"
                                                        ref={refs[1]}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card card-filter">
                                            <div className="card-body">
                                                <h4 className="card-title pb-3">
                                                    Timeframe
                                                </h4>
                                                <form className="flex-row mt-3">
                                                    <div className="tv-selector-container">
                                                        <div>
                                                            <select
                                                                defaultValue={
                                                                    timeframe
                                                                }
                                                                disabled={
                                                                    isGlobalLoading
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    changeTimeframe(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }}
                                                                className="form-control"
                                                            >
                                                                <option
                                                                    value={0}
                                                                >
                                                                    1 Day
                                                                </option>
                                                                <option
                                                                    value={1}
                                                                >
                                                                    4 Hours
                                                                </option>
                                                                <option
                                                                    value={2}
                                                                >
                                                                    1 Hour
                                                                </option>
                                                                <option
                                                                    value={3}
                                                                >
                                                                    1 Minute
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <button
                                                                disabled={
                                                                    currentDefaultTimeframe ===
                                                                    timeframe
                                                                }
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault()
                                                                    localStorage.setItem(
                                                                        'ga_default_timeframe',
                                                                        timeframe
                                                                    )
                                                                    setCurrentDefaultTimeframe(
                                                                        timeframe
                                                                    )
                                                                }}
                                                                className="btn btn-info"
                                                            >
                                                                {currentDefaultTimeframe ===
                                                                timeframe
                                                                    ? 'Default'
                                                                    : 'Set as Default'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <p></p>
                                        <div className="card card-filter card-filter-scrollable">
                                            <div className="card-body">
                                                <h4 className="card-title pb-3">
                                                    Legend
                                                </h4>
                                                <form className="flex-row mt-3">
                                                    <div className="form-group row">
                                                        <div className="col-md-12">
                                                            <div data-name="staking">
                                                                <span className="filter-name-span">
                                                                    Staking:
                                                                </span>
                                                                {methodPropsChartConfigs
                                                                    .filter(
                                                                        (e) =>
                                                                            e.type ===
                                                                            'staking'
                                                                    )
                                                                    .map(
                                                                        (
                                                                            e,
                                                                            idx
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="custom-control custom-radio select-chart-data-holder select-chart-data-holder mb-2"
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        isGlobalLoading
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        idx
                                                                                    }
                                                                                    checked={
                                                                                        method ===
                                                                                        idx
                                                                                    }
                                                                                    onChange={
                                                                                        changeMethod
                                                                                    }
                                                                                    className="input-select-chart-data"
                                                                                    name="group1[]"
                                                                                />
                                                                                <label>
                                                                                    {
                                                                                        e.title
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <br />
                                                            <div data-name="bonds">
                                                                <span className="filter-name-span">
                                                                    Bonds:
                                                                </span>
                                                                {methodPropsChartConfigs
                                                                    .filter(
                                                                        (e) =>
                                                                            e.type ===
                                                                            'bonds'
                                                                    )
                                                                    .map(
                                                                        (
                                                                            e,
                                                                            idx
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="custom-control custom-radio select-chart-data-holder mb-2"
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        isGlobalLoading
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        idx +
                                                                                        stakingLength
                                                                                    }
                                                                                    checked={
                                                                                        method ===
                                                                                        idx +
                                                                                            stakingLength
                                                                                    }
                                                                                    onChange={
                                                                                        changeMethod
                                                                                    }
                                                                                    className="input-select-chart-data"
                                                                                    name="group2[]"
                                                                                />
                                                                                <label>
                                                                                    {
                                                                                        e.title
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <br />
                                                            <div data-name="treasury">
                                                                <span className="filter-name-span">
                                                                    Treasury:
                                                                </span>
                                                                {methodPropsChartConfigs
                                                                    .filter(
                                                                        (e) =>
                                                                            e.type ===
                                                                            'treasury'
                                                                    )
                                                                    .map(
                                                                        (
                                                                            e,
                                                                            idx
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="custom-control custom-radio select-chart-data-holder mb-2"
                                                                            >
                                                                                <input
                                                                                    disabled={
                                                                                        isGlobalLoading
                                                                                    }
                                                                                    type="radio"
                                                                                    value={
                                                                                        idx +
                                                                                        bondsAndStakingLength
                                                                                    }
                                                                                    checked={
                                                                                        method ===
                                                                                        idx +
                                                                                            bondsAndStakingLength
                                                                                    }
                                                                                    onChange={
                                                                                        changeMethod
                                                                                    }
                                                                                    className="input-select-chart-data"
                                                                                    name="group3[]"
                                                                                />
                                                                                <label>
                                                                                    {
                                                                                        e.title
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
