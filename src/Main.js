import React, { useEffect, createRef } from 'react'
import { createChart } from './tv-lightweight'

import { getStakesInfoDays, mapStakes } from './dataFetch/stakes'
import { getPairsInfoDays, mapPairs } from './dataFetch/pairs'

import './styles/main.scss'

const chartConfig = {
    width: 600,
    height: 300,
    autoScale: true,
    priceScale: {
        entireTextOnly: true,
        scaleMargins: {
            top: 0.14,
            bottom: 0.14,
        },
        borderVisible: true,
    },
    crosshair: {
        mode: 0,
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
    const ref = createRef()
    const ref2 = createRef()
    const ref3 = createRef()

    useEffect(async () => {
        const chart = createChart(ref.current, chartConfig)
        const chart2 = createChart(ref2.current, {
            ...chartConfig,
            height: 200,
        })
        const chart3 = createChart(ref3.current, chartConfig)

        const tsmain = 1616457600
        const delta =
            Math.ceil((Math.floor(Date.now() / 1000) - tsmain) / 86400) + 1

        const pairs = await getPairsInfoDays(tsmain, delta)
        const pairsMapped = await mapPairs(pairs)

        const candleSeries = chart.addCandlestickSeries({
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

        const volumeUpHist = chart2.addHistogramSeries({
            ...volumeHistConfig,
            color: 'rgb(147,210,204)',
        })

        const volumeDownHist = chart2.addHistogramSeries({
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

        const stakedHist = chart3.addHistogramSeries({
            ...stakedHistConfig,
            color: 'rgb(147,210,204)',
        })

        const unstakedHist = chart3.addHistogramSeries({
            ...stakedHistConfig,
            color: 'rgb(247,169,167)',
        })

        stakedHist.setData(stakesMapped.staked)
        unstakedHist.setData(stakesMapped.unstaked)

        // crosshair

        let isCrosshairMoving,
            isChartCrosshairActive,
            isChart2CrosshairActive,
            isChart3CrosshairActive = false

        chart.subscribeCrosshairMove((param) => {
            if (!param.point) return
            if (!param.time) return
            if (isCrosshairMoving) return

            isCrosshairMoving = true
            chart2.moveCrosshair(param.point)
            chart3.moveCrosshair(param.point)
            isCrosshairMoving = false
        })

        chart2.subscribeCrosshairMove((param) => {
            if (!param.point) return
            if (!param.time) return
            if (isCrosshairMoving) return

            isCrosshairMoving = true
            chart.moveCrosshair(param.point)
            chart3.moveCrosshair(param.point)
            isCrosshairMoving = false
        })

        chart3.subscribeCrosshairMove((param) => {
            if (!param.point) return
            if (!param.time) return
            if (isCrosshairMoving) return

            isCrosshairMoving = true
            chart.moveCrosshair(param.point)
            chart2.moveCrosshair(param.point)
            isCrosshairMoving = false
        })

        ref.current.addEventListener('mousemove', () => {
            if (isChartCrosshairActive) return
            isChartCrosshairActive = true
            isChart2CrosshairActive = false
            isChart3CrosshairActive = false
            chart.applyOptions(createCrosshairOptions(isChartCrosshairActive))
            chart2.applyOptions(createCrosshairOptions(isChart2CrosshairActive))
            chart3.applyOptions(createCrosshairOptions(isChart3CrosshairActive))
        })

        ref2.current.addEventListener('mousemove', () => {
            if (isChart2CrosshairActive) return
            isChartCrosshairActive = false
            isChart2CrosshairActive = true
            isChart3CrosshairActive = false
            chart.applyOptions(createCrosshairOptions(isChartCrosshairActive))
            chart2.applyOptions(createCrosshairOptions(isChart2CrosshairActive))
            chart3.applyOptions(createCrosshairOptions(isChart3CrosshairActive))
        })

        ref3.current.addEventListener('mousemove', () => {
            if (isChart3CrosshairActive) return
            isChartCrosshairActive = false
            isChart2CrosshairActive = false
            isChart3CrosshairActive = true
            chart.applyOptions(createCrosshairOptions(isChartCrosshairActive))
            chart2.applyOptions(createCrosshairOptions(isChart2CrosshairActive))
            chart3.applyOptions(createCrosshairOptions(isChart3CrosshairActive))
        })

        chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            chart2.timeScale().setVisibleLogicalRange(range)
            chart3.timeScale().setVisibleLogicalRange(range)
        })
        chart2.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            chart.timeScale().setVisibleLogicalRange(range)
            chart3.timeScale().setVisibleLogicalRange(range)
        })

        chart3.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            chart2.timeScale().setVisibleLogicalRange(range)
            chart.timeScale().setVisibleLogicalRange(range)
        })

        chart.timeScale().applyOptions({ visible: false })
        chart2.timeScale().applyOptions({ visible: false })

        return () => {}
    }, [ref, ref2, ref3])

    return (
        <div className="dex-container">
            <div className="dex-price-outer">
                <span className="dex-price-title">SushiSwap OHM/DAI, 1D</span>
                <div className="dex-price" ref={ref}></div>
            </div>
            <div className="dex-volume-outer">
                <span className="dex-volume-title">
                    SushiSwap OHM/DAI Volume, 1D
                </span>
                <div className="dex-volume" ref={ref2}></div>
            </div>
            <div className="staking-volume-outer">
                <span className="staking-volume-title">
                    Staking & Unstaking Volume, OHM, 1D
                </span>
                <div className="staking-volume" ref={ref3}></div>
            </div>
        </div>
    )
}
