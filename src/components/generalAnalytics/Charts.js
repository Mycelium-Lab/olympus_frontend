import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../../tv-lightweight'
import moment from 'moment'

import { setMessage } from '../../redux/actions/messageActions'
import {
    setIsGlobalLoading,
    setIsPartialLoading,
} from '../../redux/actions/gaActions'
import { useDispatch, useSelector } from 'react-redux'

import {
    chartConfig,
    timeframesConfig,
    timeVisibleConfig,
    baseGranularityUnix,
    fillChart,
} from '../../util/config'
import {
    getMappedScData,
    mergeObjectsArrays,
    mergeObjectsArraysOverrideTime,
} from '../../util/dataTranformations'

import { basicMessages } from '../../util/messages'

import Chart from './Chart'

export default function GeneralAnalytics() {
    const dispatch = useDispatch()
    const {
        methods,
        timeframe,
        timezone,
        refreshRateSeconds,
        sideChartHeight,
    } = useSelector((state) => state.ga)
    const nCharts = methods.length

    const [refs, setRefs] = useState(
        [...Array(nCharts).keys()].map(() => createRef()) // create refs for charts
    )
    const [key, setKey] = useState(null) // a key to compare refs' changes
    const [updateSetInterval, setUpdateSetInterval] = useState(null) // setInterval function for rt updates

    const updateRefs = () => {
        setKey(v4()) // set the new key to toggle rerendering
        const newRefs = [...Array(nCharts).keys()].map(() => createRef())
        setRefs(newRefs)
    }

    useEffect(() => {
        updateRefs()
    }, [methods, timeframe, timezone])

    useEffect(async () => {
        const charts = refs.map((_, i) =>
            createChart(refs[i].current, {
                ...chartConfig,
                ...timeVisibleConfig(timeframe),
                height: i > 0 ? sideChartHeight : chartConfig.height, // keep the price chart bigger
            })
        )

        // fetch data and set charts

        dispatch(setIsGlobalLoading(true))

        let { fetchBackDelta, initialTimestamp, endTimestamp, intervalDiff } =
            timeframesConfig[timeframe]

        if (timeframe === 0) {
            initialTimestamp = moment
                .unix(initialTimestamp)
                .utc()
                .startOf('isoWeek')
                .unix()
            endTimestamp = moment().utc().endOf('isoWeek').unix()
        }

        const initFetchPromises = methods.map((method) =>
            getMappedScData(
                initialTimestamp,
                endTimestamp,
                method,
                timeframe,
                intervalDiff,
                timezone,
                true
            )
        )

        let mappedDataSets = await Promise.all(initFetchPromises)
        let series = mappedDataSets.map((mappedData, idx) =>
            fillChart(charts[idx], methods[idx], mappedData)
        )

        dispatch(setIsGlobalLoading(false))

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
        let els = [...Array(nCharts).keys()].map((_) => null)

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
                        dispatch(setIsPartialLoading(true))

                        const backFetchPromises = methods.map((method) =>
                            getMappedScData(
                                initialTimestamp,
                                endTimestamp,
                                method,
                                timeframe,
                                intervalDiff,
                                timezone,
                                false
                            )
                        )

                        const newMappedDataSets = await Promise.all(
                            backFetchPromises
                        )
                        mappedDataSets = newMappedDataSets.map(
                            (newMappedData, idx) =>
                                mergeObjectsArrays(
                                    mappedDataSets[idx],
                                    newMappedData
                                )
                        )
                        series = mappedDataSets.map((mappedData, idx) =>
                            fillChart(
                                charts[idx],
                                methods[idx],
                                mappedData,
                                series[idx]
                            )
                        )

                        dispatch(setIsPartialLoading(false))
                        chartNeedsUpdate = false
                    }
                })

            if (refs.length === nCharts && refs[idx].current != null) {
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

        if (updateSetInterval) {
            clearInterval(updateSetInterval)
        }

        setUpdateSetInterval(
            setInterval(async () => {
                try {
                    // for intervals > 1D (e.g., 1W), set larger boundaries for incoming queries
                    const boundaryTimeframeType =
                        timeframe > 0 ? 'day' : 'isoWeek'
                    const startDate = moment()
                        .utc()
                        .startOf(boundaryTimeframeType)
                        .unix()
                    const endDate = moment()
                        .utc()
                        .endOf(boundaryTimeframeType)
                        .unix()

                    const updatePromises = await Promise.all(
                        methods.map((method) =>
                            getMappedScData(
                                startDate,
                                endDate,
                                method,
                                timeframe,
                                intervalDiff,
                                timezone,
                                true
                            )
                        )
                    )

                    const newMappedDataSets = await Promise.all(updatePromises)

                    mappedDataSets = newMappedDataSets.map(
                        (newMappedData, idx) =>
                            mergeObjectsArraysOverrideTime(
                                mappedDataSets[idx],
                                newMappedData
                            )
                    )
                    series = mappedDataSets.map((mappedData, idx) =>
                        fillChart(
                            charts[idx],
                            methods[idx],
                            mappedData,
                            series[idx]
                        )
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
            if (updateSetInterval) clearInterval(updateSetInterval)
            charts.forEach((c) => c.remove)
            els.forEach((el) => {
                if (el) document.removeEventListener('resize', el)
            })
        }
    }, [refs])

    return (
        <div className="card card-body">
            <div key={key} className="charts-container">
                {methods.length === 0 && (
                    <div>Please select a chart from the Legend</div>
                )}
                {methods.map((method, idx) => (
                    <Chart
                        key={idx}
                        chartRef={refs[idx]}
                        index={idx}
                        {...{
                            timeframe,
                            method,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
