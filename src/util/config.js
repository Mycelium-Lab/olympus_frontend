export const chartConfig = {
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

const baseHistConfig = {
    base: 0,
    priceFormat: {
        type: 'volume',
    },
}

const baseLineConfig = {
    base: 0,
    priceFormat: {
        type: 'volume',
    },
    color: 'rgba(165, 165, 239, 0.89)',
}

class MethodPropsChartConfig {
    constructor(title, setChart, info) {
        this.title = title
        this.setChart = setChart
        this.info = info
    }
}

export const methodPropsChartConfigs = [
    new MethodPropsChartConfig(
        'Staking & Unstaking Volume, OHM',
        (chart, data) => {
            const stakedHist = chart.addHistogramSeries({
                ...baseHistConfig,
                color: 'rgb(147,210,204)',
            })

            const unstakedHist = chart.addHistogramSeries({
                ...baseHistConfig,
                color: 'rgb(247,169,167)',
            })

            stakedHist.setData(data.staked)
            unstakedHist.setData(data.unstaked)
        },
        null
    ),
    new MethodPropsChartConfig(
        'Current Staked, OHM',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.currentStaked)
        },
        null
    ),
    new MethodPropsChartConfig(
        'Stake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfig(
        'Unstake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfig(
        'Unstake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfig(
        'Unstaked to Staked, %',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.unstakedToStakedPercent)
        },
        '100 x (Unstaked - Staked) / Staked'
    ),
    new MethodPropsChartConfig(
        'Unstake to Total Staked, %',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.unstakedToTotalStakedPercent)
        },
        '100 x (Unstaked - Total Staked) / Total Staked'
    ),
]
