import { v4 } from 'uuid'
import reducer from './chartsReducer'

const defaultTimeframe = localStorage.getItem('ga_default_timeframe')
const parsedDefaultTimeframe = parseInt(defaultTimeframe)

const defaultTimezone = localStorage.getItem('ga_default_timezone')
const parsedDefaultTimezone = parseInt(defaultTimezone)

const defaultShouldRebasesLoad = localStorage.getItem(
    'ga_default_should_rebases_load'
)
const parsedDefaultShouldRebasesLoad =
    defaultShouldRebasesLoad === null || defaultShouldRebasesLoad === 'false'
        ? false
        : true

const initialState = {
    isGlobalLoading: false,
    isPartialLoading: false,
    isRebasesLoading: false, // not in use yet
    shouldRebasesLoad: parsedDefaultShouldRebasesLoad,
    methods: [
        // default charts
        { type: 'dex', orderNumber: 0, id: v4() }, // dex price
        { type: 'dex', orderNumber: 1, id: v4() }, // dex volume
        { type: 'staking', orderNumber: 0, id: v4() }, // staking & unstaking volume
    ],
    maxMethodsLength: 7,
    maxMethodsPerSection: 2,
    timeframe: isNaN(parsedDefaultTimeframe) ? 1 : parsedDefaultTimeframe,
    timezone: isNaN(parsedDefaultTimezone) ? 11 : parsedDefaultTimezone,
    refreshRateSeconds: 30,
    mainChartHeight: 360,
    sideChartHeight: 220,
}

export default function (state = initialState, action) {
    return reducer(state, action)
}
