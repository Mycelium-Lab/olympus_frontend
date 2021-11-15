import {
    SET_IS_GLOBAL_LOADING,
    SET_IS_PARTIAL_LOADING,
    SET_METHODS,
    SET_TIMEFRAME,
    SET_TIMEZONE,
} from '../types'
import { v4 } from 'uuid'

const defaultTimeframe = localStorage.getItem('ga_default_timeframe')
const parsedDefaultTimeframe = parseInt(defaultTimeframe)

const defaultTimezone = localStorage.getItem('ga_default_timezone')
const parsedDefaultTimezone = parseInt(defaultTimezone)

const initialState = {
    isGlobalLoading: false,
    isPartialLoading: false,
    methods: [
        { type: 'dex', orderNumber: 0, id: v4() },
        { type: 'staking', orderNumber: 0, id: v4() },
    ],
    maxMethodsLength: 6,
    maxMethodsPerSection: 2,
    timeframe: isNaN(parsedDefaultTimeframe) ? 1 : parsedDefaultTimeframe,
    timezone: isNaN(parsedDefaultTimezone) ? 11 : parsedDefaultTimezone,
    refreshRateSeconds: 30,
    sideChartHeight: 200,
}

const setMethodsState = (currentMethods, newMethod, maxMethodsLength) => {
    if (newMethod.hasOwnProperty('id')) {
        return currentMethods.filter((e) => e.id !== newMethod.id)
    } else {
        if (currentMethods.length <= maxMethodsLength - 1) {
            return [...currentMethods, { ...newMethod, id: v4() }] // add an id if the method is new
        } else return currentMethods
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_IS_PARTIAL_LOADING:
            return {
                ...state,
                isPartialLoading: action.payload.isPartialLoading,
            }
        case SET_IS_GLOBAL_LOADING:
            return {
                ...state,
                isGlobalLoading: action.payload.isGlobalLoading,
            }
        case SET_METHODS:
            return {
                ...state,
                methods: setMethodsState(
                    state.methods,
                    action.payload.newMethod,
                    state.maxMethodsLength
                ),
            }
        case SET_TIMEFRAME:
            return {
                ...state,
                timeframe: action.payload.timeframe,
            }
        case SET_TIMEZONE:
            return {
                ...state,
                timezone: action.payload.timezone,
            }
        default:
            return {
                ...state,
            }
    }
}
