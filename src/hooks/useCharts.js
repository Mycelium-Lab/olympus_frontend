import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'

import { setMessage } from '../redux/actions/messageActions'
import {
    setIsGlobalLoading,
    setIsPartialLoading,
} from '../redux/actions/gaActions'
import { useDispatch, useSelector } from 'react-redux'

import {
    chartConfig,
    timeframesConfig,
    timeVisibleConfig,
} from '../util/config'

import {
    initialDataFetch,
    previousDataFetch,
    updateDataFetch,
} from '../util/chartActions'

import {
    getEmptyObjectWithFillers,
    changeArrayTimestampsByDelta,
} from '../util/dataTranformations'

import { basicMessages } from '../util/messages'

import { getRebasesTimestamps } from '../dataFetch/rebases'

export default function useCharts({ store, shouldBindCrossHair }) {
    const dispatch = useDispatch()
    const {
        methods,
        timeframe,
        timezone,
        shouldRebasesLoad,
        refreshRateSeconds,
        mainChartHeight,
        sideChartHeight,
        rightPriceScaleWidth,
    } = useSelector((state) => state[store])
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
    }, [methods, timeframe, timezone, shouldRebasesLoad])

    useEffect(async () => {
        const charts = refs.map((_, i) =>
            createChart(refs[i].current, {
                ...chartConfig,
                ...timeVisibleConfig(timeframe),
                height: i === 0 ? mainChartHeight : sideChartHeight,
                ...(rightPriceScaleWidth && {
                    rightPriceScale: {
                        ...chartConfig.rightPriceScale,
                        width: rightPriceScaleWidth,
                    },
                }),
            })
        )

        // fetch data and set charts

        let { fetchBackDelta, startTimestamp, endTimestamp, intervalDiff } =
            timeframesConfig[timeframe]
        let mappedDataSets, series

        dispatch(setIsGlobalLoading(true))
        try {
            const rebasesTimestamps = shouldRebasesLoad
                ? // due to the fixed setMarkers logic in lightweight-charts,
                  // we must apply a setback by 1 time unit to display data correctly
                  changeArrayTimestampsByDelta(
                      await getRebasesTimestamps(),
                      -intervalDiff
                  )
                : null

            ;[mappedDataSets, series] = await initialDataFetch({
                startTimestamp,
                endTimestamp,
                intervalDiff,
                timeframe,
                timezone,
                shouldTrimEnd: true,
                methods,
                charts,
                rebasesTimestamps,
            })
        } catch (_) {
            dispatch(setMessage(basicMessages.requestError))
        }
        dispatch(setIsGlobalLoading(false))

        // crosshair

        let isCrosshairMoving = false

        charts.forEach((chart, idx) => {
            chart.subscribeCrosshairMove((param) => {
                if (!param.point) return
                if (!param.time) return
                if (isCrosshairMoving) return

                if (shouldBindCrossHair) {
                    isCrosshairMoving = true
                    charts
                        .slice(0, idx)
                        .concat(charts.slice(idx + 1))
                        .forEach((c) => c.moveCrosshair(param.point))
                    isCrosshairMoving = false
                }

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
                    if (shouldBindCrossHair) {
                        charts
                            .slice(0, idx)
                            .concat(charts.slice(idx + 1))
                            .forEach((c) =>
                                c.timeScale().setVisibleLogicalRange(range)
                            )
                    }

                    if (range.from < 0 && !chartNeedsUpdate) {
                        chartNeedsUpdate = true
                        // update price and volume chart
                        dispatch(setIsPartialLoading(true))
                        try {
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
                            timesFetchedPrevious++
                            chartNeedsUpdate = false
                        } catch (_) {
                            dispatch(setMessage(basicMessages.requestError))
                        }
                        dispatch(setIsPartialLoading(false))
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

        return () => {
            if (updateSetInterval) clearInterval(updateSetInterval)
            charts.forEach((c) => c.remove)
            els.forEach((el) => {
                if (el) document.removeEventListener('resize', el)
            })
        }
    }, [refs])

    return {
        refs,
        ohlcs,
        key,
        methods,
    }
}
