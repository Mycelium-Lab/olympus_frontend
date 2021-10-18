import moment from 'moment'

import {
    getTotalReservesByMinute,
    getTotalReservesByDay,
    getTotalReservesByHour,
    mapTotalReserves,
} from '../dataFetch/treasury/totalReserves'

import {
    getDepositByDay,
    getDepositByHour,
    getDepositByMinute,
    mapDeposit,
} from '../dataFetch/treasury/deposit'
import {
    getMintRewardsByDay,
    getMintRewardsByHour,
    getMintRewardsByMinute,
    mapMintRewards,
} from '../dataFetch/treasury/mintRewards'
import {
    getManageByDay,
    getManageByHour,
    getManageByMinute,
    mapManage,
} from '../dataFetch/treasury/manage'

export const chartConfig = {
    width: 800,
    height: 380,
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
            color: 'rgba(231,232,232, 0.5)',
        },
        horzLines: {
            color: 'rgba(231,232,232, 0.5)',
        },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 10,
        minBarSpacing: 3,
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

export const baseGranularityUnix = 86400

export const timeframesConfig = (() => {
    const todayMidnight = moment().utc().subtract(1, 'days').startOf('day')
    const todayHourStart = moment().utc().add(1, 'hours').startOf('hour')
    const todayMinuteStart = moment().utc().add(1, 'minutes').startOf('minute')

    const dailyFetchBackDelta = 200
    const hourlyFetchBackDelta = 10
    const minutelyFetchBackDelta = 1

    const initialDailyTimestamp = parseInt(
        todayMidnight.subtract(dailyFetchBackDelta - 3, 'days').unix()
    )

    const initialHourlyTimestamp = parseInt(
        todayHourStart.subtract(hourlyFetchBackDelta, 'days').unix()
    )

    const initialMinutelyTimestamp = parseInt(
        todayMinuteStart.subtract(minutelyFetchBackDelta, 'days').unix()
    )

    return [
        {
            name: '1D',
            initialTimestamp: initialDailyTimestamp,
            fetchBackDelta: dailyFetchBackDelta,
        },
        {
            name: '1H',
            initialTimestamp: initialHourlyTimestamp,
            fetchBackDelta: hourlyFetchBackDelta,
        },
        {
            name: '1M',
            initialTimestamp: initialMinutelyTimestamp,
            fetchBackDelta: minutelyFetchBackDelta,
        },
    ]
})()

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

class MethodPropsChartConfigTreasury extends MethodPropsChartConfig {
    constructor(title, setChart, info, getDataFunctions, mapDataFunction) {
        super(title, setChart, info, getDataFunctions, mapDataFunction)
        this.getDataFunctions = getDataFunctions
        this.mapDataFunction = mapDataFunction
        this.type = 'treasury'
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
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.currentStaked)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Stake Count',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.stakeCount)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Unstake Count',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.unstakeCount)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Max Stake, OHM',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.stakedMax)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Max Unstake, OHM',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.unstakedMax)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Average Stake, OHM',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.stakedAvg)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Average Unstake, OHM',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.unstakedAvg)
        },
        null
    ),
    new MethodPropsChartConfigStaking(
        'Unstaked to Staked, %',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.unstakedToStakedPercent)
        },
        '100 x (Unstaked - Staked) / Staked'
    ),
    new MethodPropsChartConfigStaking(
        'Unstaked to Total Staked, %',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.unstakedToTotalStakedPercent)
        },
        '100 x (Unstaked - Total Staked) / Total Staked'
    ),
    // bonds

    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, DAI',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, ETH',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountEth)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, FRAX',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, LUSD',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountLusd)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, LP OHMDAI',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountOhmDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Purchase Volume, LP OHMFRAX',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.amountOhmFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, DAI',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, ETH',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountEth)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, FRAX',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountFrax)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, LUSD',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountLusd)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, LP OHMDAI',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountOhmDai)
        },
        null
    ),
    new MethodPropsChartConfigBonds(
        'Bond Times Purchased, LP OHMFRAX',
        (chart, data) => {
            const line = chart.addHistogramSeries(baseLineConfig)
            line.setData(data.depositCountOhmFrax)
        },
        null
    ),

    // treasury
    new MethodPropsChartConfigTreasury(
        'Total Reserves (Rough Contract Estimate), OHM',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.total_reserves)
        },
        null,
        [
            getTotalReservesByDay,
            getTotalReservesByHour,
            getTotalReservesByMinute,
        ],
        mapTotalReserves
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, LP OHMFRAX',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, LP OHMDAI',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, LUSD',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0x5f98805a4e8be255a32880fdec7f6728c6568ba0')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, DAI',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0x6b175474e89094c44da98b954eedeac495271d0f')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, FRAX',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0x853d955acef822db058eb8505911ed77f175b99e')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Deposited, LP OHMLUSD',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getDepositByDay, getDepositByHour, getDepositByMinute],
        (deposit) =>
            mapDeposit(deposit, '0xfdf12d1f85b5082877a6e070524f50f6c84faa6b')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), LP OHMFRAX',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), LP OHMDAI',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), LUSD',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0x5f98805a4e8be255a32880fdec7f6728c6568ba0')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), DAI',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0x6b175474e89094c44da98b954eedeac495271d0f')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), FRAX',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0x853d955acef822db058eb8505911ed77f175b99e')
    ),
    new MethodPropsChartConfigTreasury(
        'Amount Managed (Withdrawn), LP OHMLUSD',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.amount)
        },
        null,
        [getManageByDay, getManageByHour, getManageByMinute],
        (manage) =>
            mapManage(manage, '0xfdf12d1f85b5082877a6e070524f50f6c84faa6b')
    ),
    new MethodPropsChartConfigTreasury(
        'Minted Rewards for Staking, OHM',
        (chart, data) => {
            const hist = chart.addHistogramSeries(baseLineConfig)
            hist.setData(data.minted_rewards)
        },
        null,
        [getMintRewardsByDay, getMintRewardsByHour, getMintRewardsByMinute],
        mapMintRewards
    ),
]

const typesLength = methodPropsChartConfigs.reduce(
    (acc, e) => {
        if (e.type === 'staking') acc.staking += 1
        if (e.type === 'bonds') acc.bonds += 1
        return acc
    },
    { staking: 0, bonds: 0 }
)

export const stakingLength = typesLength.staking
export const bondsAndStakingLength = stakingLength + typesLength.bonds

export const createCrosshairConfig = (flag) => ({
    crosshair: {
        horzLine: {
            visible: flag,
            labelVisible: flag,
        },
    },
})
