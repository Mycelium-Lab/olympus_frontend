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

class MethodPropsChartConfigStaking extends MethodPropsChartConfig {
    constructor(title, setChart, info) {
        super(title, setChart, info)
        this.type = 'staking'
    }
}

class MethodPropsChartConfigBonds extends MethodPropsChartConfig {
    constructor(title, setChart, info) {
        super(title, setChart, info)
        this.type = 'bonds'
    }
}

export const methodPropsChartConfigs = [
    new MethodPropsChartConfigStaking(
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
    new MethodPropsChartConfigStaking(
        'Current Staked (Cumulative), OHM',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.currentStaked)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Stake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Unstake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Unstake Count',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Unstaked to Staked, %',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.unstakedToStakedPercent)
        },
        '100 x (Unstaked - Staked) / Staked'
    ),
    new MethodPropsChartConfigStaking(
        'Unstaked to Total Staked, %',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.unstakedToTotalStakedPercent)
        },
        '100 x (Unstaked - Total Staked) / Total Staked'
    ),
    // bonds

    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, DAI',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.amountDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, ETH',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.amountEth)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, FRAX',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.amountFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, LUSD',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.amountLusd)
        },
        null
    ),
    // new MethodPropsChartConfigBonds(
    //     'Bond Purchase Volume, LP OHMDAI',
    //     (chart, data) => {
    //         const line = chart.addLineSeries(baseLineConfig)
    //         line.setData(data.amountOhmDai)
    //     },
    //     null
    // ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, LP OHMFRAX',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.amountOhmFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, DAI',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.depositCountDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, ETH',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.depositCountEth)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, FRAX',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.depositCountFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, LUSD',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.depositCountLusd)
        },
        null
    ),
    // new MethodPropsChartConfigBonds(
    //     'Bond Times Purchased, LP OHMDAI',
    //     (chart, data) => {
    //         const line = chart.addLineSeries(baseLineConfig)
    //         line.setData(data.depositCountOhmDai)
    //     },
    //     null
    // ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, LP OHMFRAX',
        (chart, data) => {
            const line = chart.addLineSeries(baseLineConfig)
            line.setData(data.depositCountOhmFrax)
        },
        null
    ),
]
