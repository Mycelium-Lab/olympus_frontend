import reducer from './chartsReducer'
import { v4 } from 'uuid'

const initialState = {
    isGlobalLoading: false,
    isPartialLoading: false,
    isRebasesLoading: false, // not in use yet
    shouldRebasesLoad: false,
    methods: [
        { type: 'index', orderNumber: 0, id: v4() }, // index
        { type: 'rebases', orderNumber: 0, id: v4() }, // rebase rate
        { type: 'rebases', orderNumber: 1, id: v4() }, // apy
        { type: 'staking', orderNumber: 3, id: v4() }, // current staked, ohm
        { type: 'staking', orderNumber: 4, id: v4() }, // current staked, usd
        { type: 'staking', orderNumber: 8, id: v4() }, // staked / unstaked %
    ],
    maxMethodsLength: Infinity,
    maxMethodsPerSection: Infinity,
    timeframe: 1, // 1D
    timezone: 11, // utc+00:00
    refreshRateSeconds: 60,
    chartParams: {
        mainChartHeight: 210,
        sideChartHeight: 210,
        mainLoadingSkeletonHeight: 210,
        sideLoadingSkeletonHeight: 210,
        rightPriceScaleWidth: null,
    },
}

export default function (state = initialState, action) {
    return reducer(state, action)
}
