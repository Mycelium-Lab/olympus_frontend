import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../../tv-lightweight'

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
} from '../../util/config'

import {
    initialDataFetch,
    previousDataFetch,
    updateDataFetch,
} from '../../util/chartActions'

import { getEmptyObjectWithFillers } from '../../util/dataTranformations'

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
        rebases,
    } = useSelector((state) => state.ga)
    const nCharts = methods.length

    const [refs, setRefs] = useState(
        [...Array(nCharts).keys()].map(() => createRef()) // create refs for charts
    )
    const [key, setKey] = useState(null) // a key to compare refs' changes
    const [updateSetInterval, setUpdateSetInterval] = useState(null) // setInterval function for rt updates
    const [ohlcs, setOhlcs] = useState(getEmptyObjectWithFillers(nCharts, null)) // open/high/low/close data

    const updateRefs = () => {
        setKey(v4()) // set the new key to toggle rerendering
        const newRefs = [...Array(nCharts).keys()].map(() => createRef())
        const newOhlc = getEmptyObjectWithFillers(nCharts, null)
        setRefs(newRefs)
        setOhlcs(newOhlc)
    }

    useEffect(() => {
        updateRefs()
    }, [methods, timeframe, timezone, rebases])

    useEffect(async () => {
        let charts,
            els = [] // charts and event listeners

        if (rebases) {
            // if rebases haven't been set as an array, don't start loading the rest
            const charts = refs.map((_, i) =>
                createChart(refs[i].current, {
                    ...chartConfig,
                    ...timeVisibleConfig(timeframe),
                    height: i > 0 ? sideChartHeight : chartConfig.height, // keep the price chart bigger
                })
            )

            // fetch data and set charts

            // dispatch(setIsGlobalLoading(true))
            let { fetchBackDelta, startTimestamp, endTimestamp, intervalDiff } =
                timeframesConfig[timeframe]

            let [mappedDataSets, series] = await initialDataFetch({
                startTimestamp,
                endTimestamp,
                intervalDiff,
                timeframe,
                timezone,
                shouldTrimEnd: true,
                methods,
                charts,
                rebasesTimestamps: rebases,
            })
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

                    if (param.hasOwnProperty('seriesPrices')) {
                        const iter = param.seriesPrices.values()
                        setOhlcs({
                            ...ohlcs,
                            [idx]: iter.next().value,
                        })
                    }
                })
            })

            // fetching past data

            let chartNeedsUpdate = false
            let timesFetchedPrevious = 0
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
                            // update price and volume chart
                            dispatch(setIsPartialLoading(true))
                            ;[mappedDataSets, series] = await previousDataFetch(
                                {
                                    lastTimestamp: startTimestamp,
                                    timesFetchedPrevious,
                                    fetchBackDelta,
                                    intervalDiff,
                                    timeframe,
                                    timezone,
                                    shouldTrimEnd: false,
                                    methods,
                                    charts,
                                    oldMappedDataSets: mappedDataSets,
                                    oldSeries: series,
                                }
                            )
                            dispatch(setIsPartialLoading(false))
                            timesFetchedPrevious++
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
                        ;[mappedDataSets, series] = await updateDataFetch({
                            intervalDiff,
                            timeframe,
                            timezone,
                            shouldTrimEnd: true,
                            methods,
                            charts,
                            oldMappedDataSets: mappedDataSets,
                            oldSeries: series,
                        })
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
        }

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
                        ohlc={ohlcs[idx]}
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
