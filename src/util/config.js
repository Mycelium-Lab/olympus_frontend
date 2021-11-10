import moment from 'moment'

import {
    totalReservesFuncs,
    mapTotalReserves,
} from '../dataFetch/treasury/totalReserves'
import { depositFuncs, mapDeposit } from '../dataFetch/treasury/deposit'
import {
    mintRewardsFuncs,
    mapMintRewards,
} from '../dataFetch/treasury/mintRewards'
import { manageFuncs, mapManage } from '../dataFetch/treasury/manage'

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

const baseCandleConfig = {
    upColor: 'rgb(37,166,154)',
    downColor: 'rgb(239,83,80)',
    borderVisible: false,
    wickVisible: true,
    borderColor: '#000000',
    wickUpColor: 'rgb(37,166,154)',
    wickDownColor: 'rgb(239,83,80)',
}

export const baseGranularityUnix = 86400

export const timeframesConfig = (() => {
    const nextDayMidnight = moment().utc().add(1, 'days').startOf('day')

    const weeklyFetchBackDelta = 200
    const dailyFetchBackDelta = 200
    const eightHourlyFetchBackDelta = 56
    const fourHourlyFetchBackDelta = 25
    const hourlyFetchBackDelta = 10
    const fifteenMinutelyFetchBackDelta = 6
    const fiveMinutelyFetchBackDelta = 4
    const minutelyFetchBackDelta = 2

    const initialWeeklyTimestamp = nextDayMidnight
        .clone()
        .subtract(weeklyFetchBackDelta, 'days')
        .unix()

    const initialDailyTimestamp = nextDayMidnight
        .clone()
        .subtract(dailyFetchBackDelta, 'days')
        .unix()

    const inititalEightHourlyTimestamp = nextDayMidnight
        .clone()
        .subtract(eightHourlyFetchBackDelta, 'days')
        .unix()

    const initialFourHourlyTimestamp = nextDayMidnight
        .clone()
        .subtract(fourHourlyFetchBackDelta, 'days')
        .unix()

    const initialHourlyTimestamp = nextDayMidnight
        .clone()
        .subtract(hourlyFetchBackDelta, 'days')
        .unix()

    const initialFifteenMinutelyTimestamp = nextDayMidnight
        .clone()
        .subtract(fifteenMinutelyFetchBackDelta, 'days')
        .unix()

    const initialFiveMinutelyTimestamp = nextDayMidnight
        .clone()
        .subtract(fiveMinutelyFetchBackDelta, 'days')
        .unix()

    const initialMinutelyTimestamp = nextDayMidnight
        .clone()
        .subtract(minutelyFetchBackDelta, 'days')
        .unix()

    const endTimestamp = nextDayMidnight.unix()

    return [
        {
            name: '1W',
            initialTimestamp: initialWeeklyTimestamp,
            endTimestamp,
            fetchBackDelta: weeklyFetchBackDelta,
            intervalDiff: 86400 * 7,
        },
        {
            name: '1D',
            initialTimestamp: initialDailyTimestamp,
            endTimestamp,
            fetchBackDelta: dailyFetchBackDelta,
            intervalDiff: 86400,
        },
        {
            name: '8H',
            initialTimestamp: inititalEightHourlyTimestamp,
            endTimestamp,
            fetchBackDelta: eightHourlyFetchBackDelta,
            intervalDiff: 86400 / 3,
        },
        {
            name: '4H',
            initialTimestamp: initialFourHourlyTimestamp,
            endTimestamp,
            fetchBackDelta: fourHourlyFetchBackDelta,
            intervalDiff: 86400 / 6,
        },
        {
            name: '1H',
            initialTimestamp: initialHourlyTimestamp,
            endTimestamp,
            fetchBackDelta: hourlyFetchBackDelta,
            intervalDiff: 86400 / 24,
        },
        {
            name: '15M',
            initialTimestamp: initialFifteenMinutelyTimestamp,
            endTimestamp,
            fetchBackDelta: fifteenMinutelyFetchBackDelta,
            intervalDiff: 86400 / 24 / 4,
        },
        {
            name: '5M',
            initialTimestamp: initialFiveMinutelyTimestamp,
            endTimestamp,
            fetchBackDelta: fiveMinutelyFetchBackDelta,
            intervalDiff: 86400 / 24 / 12,
        },
        {
            name: '1M',
            initialTimestamp: initialMinutelyTimestamp,
            endTimestamp,
            fetchBackDelta: minutelyFetchBackDelta,
            intervalDiff: 86400 / 24 / 60,
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

class MethodPropsChartConfigTreasury extends MethodPropsChartConfig {
    constructor(title, setChart, info, getDataFunctions, mapDataFunction) {
        super(title, setChart, info, getDataFunctions, mapDataFunction)
        this.getDataFunctions = getDataFunctions
        this.mapDataFunction = mapDataFunction
    }
}

const setBaseHist = (
    chart,
    data,
    series,
    dataProperty,
    seriesConfig = baseLineConfig
) => {
    let hist
    if (!series) {
        hist = chart.addHistogramSeries({
            ...baseLineConfig,
            ...seriesConfig,
        })
    } else {
        hist = series[0]
    }
    hist.setData(data[dataProperty])
    return [hist]
}

// polar, e.g., staking & unstaking, the former is positive, the latter is negative
const setBasePolarHist = (chart, data, series, dataProperties) => {
    let posHist, negHist

    if (!series) {
        posHist = chart.addHistogramSeries({
            ...baseHistConfig,
            color: 'rgb(147,210,204)',
        })

        negHist = chart.addHistogramSeries({
            ...baseHistConfig,
            color: 'rgb(247,169,167)',
        })
    } else {
        ;[posHist, negHist] = series
    }

    posHist.setData(data[dataProperties[0]])
    negHist.setData(data[dataProperties[1]])

    return [posHist, negHist]
}

export const methodPropsChartConfigs = {
    dex: [
        new MethodPropsChartConfig(
            'SushiSwap OHM/DAI Price & Volume',
            (chart, data, series) => {
                let candleSeries, volumeUpHistSeries, volumeDownHistSeries
                if (!series) {
                    candleSeries = chart.addCandlestickSeries(baseCandleConfig)

                    const volumeHistConfig = {
                        ...baseHistConfig,
                        overlay: true,
                        scaleMargins: {
                            top: 0.6,
                            bottom: 0.04,
                        },
                    }

                    volumeUpHistSeries = chart.addHistogramSeries({
                        ...volumeHistConfig,
                        color: 'rgb(147,210,204)',
                    })

                    volumeDownHistSeries = chart.addHistogramSeries({
                        ...volumeHistConfig,
                        color: 'rgb(247,169,167)',
                    })
                } else {
                    ;[candleSeries, volumeUpHistSeries, volumeDownHistSeries] =
                        series
                }

                candleSeries.setData(data.priceCandles)
                volumeUpHistSeries.setData(data.volumeUp)
                volumeDownHistSeries.setData(data.volumeDown)

                return [candleSeries, volumeUpHistSeries, volumeDownHistSeries]
            }
        ),
    ],
    staking: [
        new MethodPropsChartConfig(
            'Staking & Unstaking Volume, OHM',
            (...args) => setBasePolarHist(...args, ['staked', 'unstaked']),
            'Staking (+) and Unstaking (-) Volume per Bar'
        ),
        new MethodPropsChartConfig(
            'Netto Staked, OHM',
            (...args) => setBaseHist(...args, 'nettoStaked'),
            'Staked - Unstaked per Bar'
        ),
        new MethodPropsChartConfig(
            'Staking & Unstaking Volume with Netto, OHM',
            (chart, data, series) => {
                let posHist, negHist, nettoHist

                if (!series) {
                    posHist = chart.addHistogramSeries({
                        ...baseHistConfig,
                        color: 'rgb(147,210,204)',
                    })

                    negHist = chart.addHistogramSeries({
                        ...baseHistConfig,
                        color: 'rgb(247,169,167)',
                    })

                    nettoHist = chart.addHistogramSeries(baseLineConfig)
                } else {
                    ;[posHist, negHist, nettoHist] = series
                }

                posHist.setData(data.stakedWithNetto)
                negHist.setData(data.unstakedWithNetto)
                nettoHist.setData(data.nettoStaked)

                return [posHist, negHist, nettoHist]
            },
            'Staking (+) and Unstaking (-) Volume Summed with Netto per Bar'
        ),
        new MethodPropsChartConfig(
            'Current Staked (Cumulative), OHM',
            (...args) => setBaseHist(...args, 'currentStaked'),
            'OHM Staked at the Moment'
        ),
        new MethodPropsChartConfig(
            'Stake & Unstake Count',
            (...args) =>
                setBasePolarHist(...args, ['stakeCount', 'unstakeCount']),
            'Times Staked (+) and Unstated (-) per Bar'
        ),
        new MethodPropsChartConfig(
            'Max Stake & Unstake, OHM',
            (...args) =>
                setBasePolarHist(...args, ['stakedMax', 'unstakedMax']),
            'Max Amount of 1 Staking (+) and Unstaking (-) per Bar'
        ),
        new MethodPropsChartConfig(
            'Average Stake & Unstake, OHM',
            (...args) =>
                setBasePolarHist(...args, ['stakedAvg', 'unstakedAvg']),
            'Average Amount of 1 Staking (+) and Unstaking (-) per Bar'
        ),
        new MethodPropsChartConfig(
            'Staked to Unstaked, %',
            (...args) =>
                setBaseHist(...args, 'unstakedToStakedPercent', {
                    priceFormat: {
                        type: 'percent',
                    },
                }),
            '[-1 x 100 x (Unstaked - Staked) / Unstaked] per Bar'
        ),
        new MethodPropsChartConfig(
            'Unstaked of Total Staked, %',
            (...args) =>
                setBaseHist(...args, 'unstakedOfTotalStakedPercent', {
                    priceFormat: {
                        type: 'percent',
                    },
                }),
            '[-1 x 100 x (Unstaked / Current Total Staked)] per Bar'
        ),
    ],
    rebases: [
        new MethodPropsChartConfig(
            'Rebase Rate, %',
            (...args) => setBaseHist(...args, 'rebasePercentage'),
            null
        ),
        new MethodPropsChartConfig(
            'APY, %',
            (...args) =>
                setBaseHist(...args, 'apy', {
                    priceFormat: {
                        type: 'percent',
                    },
                }),
            null
        ),
    ],
    bonds: [
        new MethodPropsChartConfig(
            'Bond Purchase Volume, DAI',
            (...args) => setBaseHist(...args, 'amountDai'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, DAI',
            (...args) => setBaseHist(...args, 'depositCountDai'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, DAI (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVDai'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, wETH',
            (...args) => setBaseHist(...args, 'amountEth'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, wETH',
            (...args) => setBaseHist(...args, 'depositCountEth'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, wETH (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVEth'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, FRAX',
            (...args) => setBaseHist(...args, 'amountFrax'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, FRAX',
            (...args) => setBaseHist(...args, 'depositCountFrax'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, FRAX (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVFrax'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, LUSD',
            (...args) => setBaseHist(...args, 'amountLusd'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, LUSD',
            (...args) => setBaseHist(...args, 'depositCountLusd'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, LUSD (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVLusd'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, LP OHMDAI',
            (...args) => setBaseHist(...args, 'amountOhmDai'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, LP OHMDAI',
            (...args) => setBaseHist(...args, 'depositCountOhmDai'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, LP OHMDAI (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVOhmDai'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, LP OHMFRAX',
            (...args) => setBaseHist(...args, 'amountOhmFrax'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, LP OHMFRAX',
            (...args) => setBaseHist(...args, 'depositCountOhmFrax'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, LP OHMFRAX (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVOhmFrax'),
            null
        ),

        new MethodPropsChartConfig(
            'Bond Purchase Volume, LP OHMLUSD',
            (...args) => setBaseHist(...args, 'amountOhmLusd'),
            null
        ),
        new MethodPropsChartConfig(
            'Bond Times Purchased, LP OHMLUSD',
            (...args) => setBaseHist(...args, 'depositCountOhmLusd'),
            null
        ),
        new MethodPropsChartConfig(
            'BCV Rate, LP OHMLUSD (Scaled by 10<sup>7</sup>)',
            (...args) => setBaseHist(...args, 'newBCVOhmLusd'),
            null
        ),
    ],
    treasury: [
        new MethodPropsChartConfigTreasury(
            'Total Reserves (Rough Contract Estimate), OHM',
            (...args) => setBaseHist(...args, 'total_reserves'),
            'How Treasury Contract Estimates its Reserves (Holdings of 4 Reserve Tokens: DAI, OHM, LUSD, wETH ) in a 1 Token = 1 OHM Proportion via the valueOf function',
            totalReservesFuncs,
            mapTotalReserves
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Deposited, DAI',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of DAI Deposited to Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0x6b175474e89094c44da98b954eedeac495271d0f'
                )
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), DAI',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of DAI Withdrawn from Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0x6b175474e89094c44da98b954eedeac495271d0f')
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Deposited, FRAX',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of FRAX Deposited to Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0x853d955acef822db058eb8505911ed77f175b99e'
                )
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), FRAX',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of FRAX Withdrawn from Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0x853d955acef822db058eb8505911ed77f175b99e')
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Deposited, LUSD',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LUSD Deposited to Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0'
                )
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), LUSD',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LUSD Withdrawn from Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0x5f98805a4e8be255a32880fdec7f6728c6568ba0')
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Deposited, LP OHMDAI',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMDAI Deposited to Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c'
                )
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), LP OHMDAI',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMDAI Withdrawn from Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c')
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Deposited, LP OHMLUSD',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMLUSD Deposited to Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0xfdf12d1f85b5082877a6e070524f50f6c84faa6b'
                )
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), LP OHMLUSD',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMLUSD Withdrawn from Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0xfdf12d1f85b5082877a6e070524f50f6c84faa6b')
        ),

        new MethodPropsChartConfigTreasury(
            'Amount Managed (Withdrawn), LP OHMFRAX',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMFRAX Deposited to Treasury Contract',
            manageFuncs,
            (manage) =>
                mapManage(manage, '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877')
        ),
        new MethodPropsChartConfigTreasury(
            'Amount Deposited, LP OHMFRAX',
            (...args) => setBaseHist(...args, 'amount'),
            'Amount of LP OHMFRAX Withdrawn from Treasury Contract',
            depositFuncs,
            (deposit) =>
                mapDeposit(
                    deposit,
                    '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877'
                )
        ),

        new MethodPropsChartConfigTreasury(
            'Minted Rewards for Staking, OHM',
            (...args) => setBaseHist(...args, 'minted_rewards'),
            "Rewards Minted by Treasury For Distributing Stakers' Rewards to V1 and V2 Staking Contracts",
            mintRewardsFuncs,
            mapMintRewards
        ),
    ],
}

export const createCrosshairConfig = (flag) => ({
    crosshair: {
        horzLine: {
            visible: flag,
            labelVisible: flag,
        },
    },
})

export const fillChart = (chart, method, mappedData, scSeries) =>
    methodPropsChartConfigs[method.type][method.orderNumber].setChart(
        chart,
        mappedData,
        scSeries
    )
