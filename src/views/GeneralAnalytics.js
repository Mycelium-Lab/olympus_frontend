import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'
import moment from 'moment'
import parse from 'html-react-parser'

import { setMessage } from '../redux/actions/messageActions'
import { useDispatch } from 'react-redux'

import { ReactComponent as LoadingSpinner } from '../images/vectors/spinner.svg'
import { Skeleton } from '@mui/material'

import {
    chartConfig,
    methodPropsChartConfigs,
    timeframesConfig,
    baseGranularityUnix,
    fillChart,
} from '../util/config'
import {
    getMappedScData,
    mergeObjectsArrays,
    mergeObjectsArraysOverrideTime,
} from '../util/dataTranformations'

import { basicMessages } from '../util/messages'

import '../styles/main.scss'
import '../styles/generalAnalytics.scss'
import ChartParamsSelection from '../components/generalAnalytics/ChartParamsSelection'
import ChartLegend from '../components/generalAnalytics/ChartLegend'

const defaultTimeframe = localStorage.getItem('ga_default_timeframe')
const defaultTimezone = localStorage.getItem('ga_default_timezone')

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
    const [currentDefaultTimezone, setCurrentDefaultTimezone] = useState(
        defaultTimezone ? parseInt(defaultTimezone) : null
    )

    const [timeframe, setTimeframe] = useState(currentDefaultTimeframe ?? 1) // 1D
    const [timezone, setTimezone] = useState(currentDefaultTimezone ?? 11) // UTC+00:00

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
            setCurrentDefaultTimeframe(newTimeframe)
            localStorage.setItem('ga_default_timeframe', newTimeframe)
        }
    }

    const changeTimezone = (newTimezone) => {
        if (timezone !== newTimezone) {
            updateRefs()
            setTimezone(newTimezone)
            setCurrentDefaultTimezone(newTimezone)
            localStorage.setItem('ga_default_timezone', newTimezone)
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
            if (i > 0) {
                // keep the price chart bigger
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
                timezone,
                true
            ),
            getMappedScData(
                initialTimestamp,
                endTimestamp,
                method,
                timeframe,
                intervalDiff,
                timezone,
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
                                timezone,
                                false
                            ),
                            getMappedScData(
                                initialTimestamp,
                                endTimestamp,
                                method,
                                timeframe,
                                intervalDiff,
                                timezone,
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
                    // for intervals > 1D (e.g., 1W), set larger boundaries for incoming queries
                    const boundaryTimeframeType = timeframe > 0 ? 'day' : 'week'
                    const startDate = moment()
                        .utc()
                        .startOf(boundaryTimeframeType)
                        .unix()
                    const endDate = moment()
                        .utc()
                        .endOf(boundaryTimeframeType)
                        .unix()

                    const updatePromises = await Promise.all([
                        getMappedScData(
                            startDate,
                            endDate,
                            dexMethod,
                            timeframe,
                            intervalDiff,
                            timezone,
                            true
                        ),
                        getMappedScData(
                            startDate,
                            endDate,
                            method,
                            timeframe,
                            intervalDiff,
                            timezone,
                            true
                        ),
                    ])

                    const resolvedDataFetch = await Promise.all(updatePromises)
                    const [updateDexMapped, updateScMapped] = resolvedDataFetch

                    dexMapped = mergeObjectsArraysOverrideTime(
                        dexMapped,
                        updateDexMapped
                    )
                    scMapped = mergeObjectsArraysOverrideTime(
                        scMapped,
                        updateScMapped
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
    }, [method, timeframe, timezone])

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
                                        <ChartParamsSelection
                                            {...{
                                                timeframe,
                                                changeTimeframe,
                                                timezone,
                                                changeTimezone,
                                                isGlobalLoading,
                                            }}
                                        />
                                        <p></p>
                                        <ChartLegend
                                            {...{
                                                isGlobalLoading,
                                                method,
                                                changeMethod,
                                            }}
                                        />
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
