import React, { useEffect, useState, createRef } from 'react'
import { v4 } from 'uuid'
import { createChart } from '../tv-lightweight'

import { getStakesInfoDays, mapStakes } from '../dataFetch/stakes'
import { getDepositsInfoDays, mapBonds } from '../dataFetch/bonds'
import { getPairsInfoDays, mapPairs } from '../dataFetch/pairs'
import { chartConfig, methodPropsChartConfigs } from '../util/config'

import '../styles/main.scss'

const createCrosshairOptions = (flag) => ({
    crosshair: {
        horzLine: {
            visible: flag,
            labelVisible: flag,
        },
    },
})

const stakingLength = methodPropsChartConfigs.reduce((acc, e) => {
    if (e.type === 'staking') acc += 1
    return acc
}, 0)

const fillChart = async (chart, startTime, delta, method) => {
    let mappedData

    const typeOfData = methodPropsChartConfigs[method].type
    switch (typeOfData) {
        case 'staking':
            const stakes = await getStakesInfoDays(startTime, delta)
            mappedData = await mapStakes(stakes)
            break
        case 'bonds':
            const bonds = await getDepositsInfoDays(startTime, delta)
            mappedData = await mapBonds(bonds)
            break
        default:
            break
    }

    methodPropsChartConfigs[method].setChart(chart, mappedData)
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

        // data and charts' config

        const tsmain = 1616457600
        const delta =
            Math.ceil((Math.floor(Date.now() / 1000) - tsmain) / 86400) + 1

        // main data (dex price + volume)

        const pairs = await getPairsInfoDays(tsmain, delta)
        const pairsMapped = await mapPairs(pairs)

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

        await fillChart(charts[2], tsmain, delta, method)

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

                    charts[idx].applyOptions(createCrosshairOptions(e))
                })
            })
        })

        charts.forEach((chart, idx) => {
            chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
                charts
                    .slice(0, idx)
                    .concat(charts.slice(idx + 1))
                    .forEach((c) => c.timeScale().setVisibleLogicalRange(range))
            })
        })

        // charts[0].timeScale().applyOptions({ visible: false })
        // charts[1].timeScale().applyOptions({ visible: false })

        return () => {}
    }, [method])

    return (
        <div className="main">
            <div className="inputs">
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
                            <div key={idx + stakingLength}>
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
            </div>
            <div key={key} className="dex-container">
                <div className="dex-price-outer">
                    <span className="dex-price-title">
                        SushiSwap OHM/DAI, 1D
                    </span>
                    <div className="dex-price" ref={refs[0]}></div>
                </div>
                <div className="dex-volume-outer">
                    <span className="dex-volume-title">
                        SushiSwap OHM/DAI Volume, 1D
                    </span>
                    <div className="dex-volume" ref={refs[1]}></div>
                </div>
                <div className="staking-volume-outer">
                    <span className="staking-volume-title">
                        {`${methodPropsChartConfigs[method].title}, 1D`}
                    </span>
                    <div className="staking-volume" ref={refs[2]}></div>
                </div>
            </div>
        </div>
    )
}
