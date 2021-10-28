import React, { useEffect, useState, createRef } from 'react'
import ChartSelectSection from '../components/generalAnalytics/ChartSelectSection'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'
import moment from 'moment'
import parse from 'html-react-parser'

import { setMessage } from '../redux/actions/messageActions'
import { useDispatch } from 'react-redux'

import { Skeleton } from '@mui/material'

import {
    chartConfig,
    methodPropsChartConfigs,
    timeframesConfig,
    createCrosshairConfig,
    baseGranularityUnix,
    fillChart,
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
import { basicMessages } from '../util/messages'

const defaultTimeframe = localStorage.getItem('ga_default_timeframe')

export default function GeneralAnalytics() {
    const dispatch = useDispatch()

    const refreshRateSeconds = 30
    const nCharts = 2

    const [refs, setRefs] = useState(
        Array.from(Array(nCharts).keys()).map((_) => createRef())
    )

    const [key, setKey] = useState(null)
    const [method, setMethod] = useState({
        type: 'staking',
        orderNumber: 0,
    })
    const [currentDefaultTimeframe, setCurrentDefaultTimeframe] = useState(
        defaultTimeframe ? parseInt(defaultTimeframe) : null
    )
    const [timeframe, setTimeframe] = useState(currentDefaultTimeframe ?? 0)

    const [isGlobalLoading, setIsGlobalLoading] = useState(false)
    const [isPartialLoading, setIsPartialLoading] = useState(false)

    const [updateInterval, setUpdateInterval] = useState(null)

    const changeMethod = (type, orderNumber) => {
        if (type !== method.type || orderNumber !== method.orderNumber) {
            updateRefs()
            setMethod({
                type,
                orderNumber,
            })
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

        // fetch data and set charts

        let dexMapped, scMapped

        let { fetchBackDelta, initialTimestamp, endTimestamp, intervalDiff } =
            timeframesConfig[timeframe]

        const dexMethod = { type: 'dex', orderNumber: 0 }

        const initFetchPromises = [
            getMappedScData(
                initialTimestamp,
                endTimestamp,
                dexMethod,
                timeframe,
                intervalDiff,
                true
            ),
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
        const resolvedDataFetch = await Promise.all(initFetchPromises)
        setIsGlobalLoading(false)
        ;[dexMapped, scMapped] = resolvedDataFetch

        let dexSeries = fillChart(charts[0], dexMethod, dexMapped)
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
                        const backFetchPromises = [
                            getMappedScData(
                                initialTimestamp,
                                endTimestamp,
                                dexMethod,
                                timeframe,
                                intervalDiff,
                                false
                            ),
                            getMappedScData(
                                initialTimestamp,
                                endTimestamp,
                                method,
                                timeframe,
                                intervalDiff,
                                false
                            ),
                        ]

                        setIsPartialLoading(true)
                        const resolvedDataFetch = await Promise.all(
                            backFetchPromises
                        )
                        setIsPartialLoading(false)
                        const [newDexMapped, newScMapped] = resolvedDataFetch

                        scMapped = mergeObjectsArrays(scMapped, newScMapped)
                        dexMapped = mergeObjectsArrays(dexMapped, newDexMapped)

                        dexSeries = fillChart(
                            charts[0],
                            dexMethod,
                            dexMapped,
                            dexSeries
                        )
                        scSeries = fillChart(
                            charts[charts.length - 1],
                            method,
                            scMapped,
                            scSeries
                        )

                        chartNeedsUpdate = false
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
                        getMappedScData(
                            startDate,
                            endDate,
                            dexMethod,
                            timeframe,
                            intervalDiff,
                            false
                        ),
                        getMappedScData(
                            startDate,
                            endDate,
                            method,
                            timeframe,
                            intervalDiff,
                            false
                        ),
                    ])

                    const resolvedDataFetch = await Promise.all(updatePromises)
                    const [updateDexMapped, updateScMapped] = resolvedDataFetch

                    dexMapped = mergeObjectsArraysOverrideTime(
                        dexMapped,
                        trimDataSetEnd(updateDexMapped)
                    )
                    scMapped = mergeObjectsArraysOverrideTime(
                        scMapped,
                        trimDataSetEnd(updateScMapped)
                    )

                    dexSeries = fillChart(
                        charts[0],
                        dexMethod,
                        dexMapped,
                        dexSeries
                    )
                    scSeries = fillChart(
                        charts[charts.length - 1],
                        method,
                        scMapped,
                        scSeries
                    )
                } catch (e) {
                    dispatch(
                        setMessage(
                            basicMessages.refreshRequestError(
                                refreshRateSeconds
                            )
                        )
                    )
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
                                                        {parse(
                                                            methodPropsChartConfigs[
                                                                method.type
                                                            ][
                                                                method
                                                                    .orderNumber
                                                            ].title
                                                        )}
                                                        ,
                                                        {` ${timeframesConfig[timeframe].name}`}
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
                                                            <ChartSelectSection
                                                                sectionName="staking"
                                                                {...{
                                                                    isGlobalLoading,
                                                                    method,
                                                                    changeMethod,
                                                                }}
                                                            />
                                                            <br />
                                                            <ChartSelectSection
                                                                sectionName="bonds"
                                                                {...{
                                                                    isGlobalLoading,
                                                                    method,
                                                                    changeMethod,
                                                                }}
                                                            />
                                                            <br />
                                                            <ChartSelectSection
                                                                sectionName="treasury"
                                                                {...{
                                                                    isGlobalLoading,
                                                                    method,
                                                                    changeMethod,
                                                                }}
                                                            />
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
