import React, { useEffect, createRef } from 'react'
import { createChart } from './tv-lightweight'

import { getStakesInfoDays, mapStakes } from './dataFetch/stakes'
import { getPairsInfoDays, mapPairs } from './dataFetch/pairs'

import './styles/main.scss'

const chartConfig = {
    width: 600,
    height: 300,
    autoScale: true,
    rightPriceScale: {
        entireTextOnly: true,
        scaleMargins: {
            top: 0.14,
            bottom: 0.14,
        },
        borderVisible: true,
    },
    crosshair: {
        mode: 1,
    },
    drawTicks: true,
    layout: {
        backgroundColor: '#FFFFFF',
        textColor: 'rgb(18,23,34)',
    },
    grid: {
        vertLines: {
            color: 'rgb(231,232,232)',
        },
        horzLines: {
            color: 'rgb(231,232,232)',
        },
    },
}

const createCrosshairOptions = (flag) => ({
    crosshair: {
        horzLine: {
            visible: flag,
            labelVisible: flag,
        },
    },
})

export default function Main() {
    const refs = []
    Array.from(Array(3).keys()).forEach((_) => refs.push(createRef()))

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

        const stakes = await getStakesInfoDays(tsmain, delta)
        const stakesMapped = await mapStakes(stakes)

        const stakedHistConfig = {
            base: 0,
            priceFormat: {
                type: 'volume',
            },
        }

        const stakedHist = charts[2].addHistogramSeries({
            ...stakedHistConfig,
            color: 'rgb(147,210,204)',
        })

        const unstakedHist = charts[2].addHistogramSeries({
            ...stakedHistConfig,
            color: 'rgb(247,169,167)',
        })

        stakedHist.setData(stakesMapped.staked)
        unstakedHist.setData(stakesMapped.unstaked)

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
    }, refs)

    return (
        <div className="dex-container">
            <div className="dex-price-outer">
                <span className="dex-price-title">SushiSwap OHM/DAI, 1D</span>
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
                    Staking & Unstaking Volume, OHM, 1D
                </span>
                <div className="staking-volume" ref={refs[2]}></div>
            </div>
        </div>
    )
}
