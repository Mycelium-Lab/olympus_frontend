import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'

import {
    getStakesInfoDays,
    getStakesInfoHours,
    getStakesInfoMinutes,
    mapStakes,
} from '../dataFetch/stakes'
import {
    getDepositsInfoDays,
    getDepositsInfoHours,
    getDepositsInfoMinutes,
    mapBonds,
} from '../dataFetch/bonds'
import {
    getPairsInfoDays,
    getPairsInfoHours,
    getPairsInfoMinutes,
    mapPairs,
} from '../dataFetch/pairs'
import {
    chartConfig,
    methodPropsChartConfigs,
    stakingLength,
    bondsAndStakingLength,
    timeframesConfig,
    createCrosshairConfig,
    baseGranularityUnix,
} from '../util/config'
import { getMappedScData } from '../util/dataTranformations'

import '../styles/main.scss'

const fillChart = async (chart, method, mappedData) => {
    methodPropsChartConfigs[method].setChart(chart, mappedData)
}

const getPairsInfoFunction = (timeframe) => {
    switch (timeframe) {
        case 0:
            return getPairsInfoDays
        case 1:
            return getPairsInfoHours
        case 2:
            return getPairsInfoMinutes
        default:
            return
    }
}

export default function Main() {
    const [refs, setRefs] = useState(
        Array.from(Array(3).keys()).map((_) => createRef())
    )

    const [key, setKey] = useState(null)
    const [method, setMethod] = useState(0)
    const [timeframe, setTimeframe] = useState(0)

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
        const newRefs = Array.from(Array(3).keys()).map((_) => createRef())
        setRefs(newRefs)
    }

    useEffect(async () => {
        const charts = refs.map((_, i) => {
            if (i == 1) {
                return createChart(refs[i].current, {
                    ...chartConfig,
                    height: 200,
                })
            }
            return createChart(refs[i].current, chartConfig)
        })

        // main data (dex price + volume)

        let pairs, pairsMapped

        let { fetchBackDelta, initialTimestamp } = timeframesConfig[timeframe]

        const getPairsInfo = getPairsInfoFunction(timeframe) // get a corresponding fetch function with respect to timeframe
        pairs = await getPairsInfo(
            initialTimestamp,
            fetchBackDelta,
            2021,
            'OHM',
            'DAI'
        )
        pairsMapped = await mapPairs(pairs)

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
        }

        const volumeUpHist = charts[1].addHistogramSeries({
            ...volumeHistConfig,
            color: 'rgb(147,210,204)',
        })

        const volumeDownHist = charts[1].addHistogramSeries({
            ...volumeHistConfig,
            color: 'rgb(247,169,167)',
        })

        volumeUpHist.setData(pairsMapped.volumeUp)
        volumeDownHist.setData(pairsMapped.volumeDown)

        // additional data from smart contracts

        let scMapped = await getMappedScData(
            initialTimestamp,
            fetchBackDelta,
            method,
            timeframe
        )

        fillChart(charts[2], method, scMapped)

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

        let chartNeedsUpdate = false
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
                        initialTimestamp =
                            initialTimestamp -
                            fetchBackDelta * baseGranularityUnix
                        const newPairsData = await getPairsInfo(
                            initialTimestamp,
                            fetchBackDelta,
                            2021,
                            'OHM',
                            'DAI'
                        )
                        const newPairsMapped = mapPairs(newPairsData)
                        pairsMapped.priceCandles = [
                            ...newPairsMapped.priceCandles,
                            ...pairsMapped.priceCandles,
                        ]
                        pairsMapped.volumeUp = [
                            ...newPairsMapped.volumeUp,
                            ...pairsMapped.volumeUp,
                        ]
                        pairsMapped.volumeDown = [
                            ...newPairsMapped.volumeDown,
                            ...pairsMapped.volumeDown,
                        ]

                        candleSeries.setData(pairsMapped.priceCandles)
                        volumeUpHist.setData(pairsMapped.volumeUp)
                        volumeDownHist.setData(pairsMapped.volumeDown)

                        const newScMapped = await getMappedScData(
                            initialTimestamp,
                            fetchBackDelta,
                            method,
                            timeframe
                        )

                        Object.keys(scMapped).forEach((key) => {
                            scMapped[key] = [
                                ...newScMapped[key],
                                ...scMapped[key],
                            ]
                        })

                        fillChart(charts[2], method, scMapped)

                        chartNeedsUpdate = false
                    }
                })
        })
        return () => {}
    }, [method, timeframe])

    return (
        <div className="main">
            <div className="inputs">
                <div className="inputs-switch-interval">
                    <span>Intervals:</span>
                    <div>
                        <div onClick={() => changeTimeframe(0)}>1D</div>
                        <div onClick={() => changeTimeframe(1)}>1H</div>
                        {/* <div onClick={() => changeTimeframe(2)}>1M</div> */}
                    </div>
                </div>
                <div className="inputs-staking">
                    <span>Staking:</span>
                    {methodPropsChartConfigs
                        .filter((e) => e.type === 'staking')
                        .map((e, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    value={idx}
                                    checked={method === idx}
                                    onChange={changeMethod}
                                />
                                <label>{e.title}</label>
                                {e.info && (
                                    <span className="input__info-label">
                                        : {e.info}
                                    </span>
                                )}
                            </div>
                        ))}
                </div>
                <div className="inputs-bonds">
                    <span>Bonds:</span>
                    {methodPropsChartConfigs
                        .filter((e) => e.type === 'bonds')
                        .map((e, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    value={idx + stakingLength}
                                    checked={method === idx + stakingLength}
                                    onChange={changeMethod}
                                />
                                <label>{e.title}</label>
                                {e.info && (
                                    <span className="input__info-label">
                                        : {e.info}
                                    </span>
                                )}
                            </div>
                        ))}
                </div>
                {/* <div className="inputs-treasury">
                    <span>Treasury:</span>
                    {methodPropsChartConfigs
                        .filter((e) => e.type === 'treasury')
                        .map((e, idx) => (
                            <div key={idx}>
                                <input
                                    type="radio"
                                    value={idx + bondsAndStakingLength}
                                    checked={
                                        method === idx + bondsAndStakingLength
                                    }
                                    onChange={changeMethod}
                                />
                                <label>{e.title}</label>
                                {e.info && (
                                    <span className="input__info-label">
                                        : {e.info}
                                    </span>
                                )}
                            </div>
                        ))}
                </div> */}
            </div>
            <div key={key} className="dex-container">
                <div className="dex-price-outer">
                    <span className="dex-price-title">
                        SushiSwap OHM/DAI, {timeframesConfig[timeframe].name}
                    </span>
                    <div className="dex-price" ref={refs[0]}></div>
                </div>
                <div className="dex-volume-outer">
                    <span className="dex-volume-title">
                        SushiSwap OHM/DAI Volume,{' '}
                        {timeframesConfig[timeframe].name}
                    </span>
                    <div className="dex-volume" ref={refs[1]}></div>
                </div>
                <div className="staking-volume-outer">
                    <span className="staking-volume-title">
                        {`${methodPropsChartConfigs[method].title}, ${timeframesConfig[timeframe].name}`}
                    </span>
                    <div className="staking-volume" ref={refs[2]}></div>
                </div>
            </div>
        </div>
    )
}
