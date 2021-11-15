import {
    SET_IS_GLOBAL_LOADING,
    SET_IS_PARTIAL_LOADING,
    SET_METHODS,
    SET_TIMEFRAME,
    SET_TIMEZONE,
} from '../types'

export const setIsGlobalLoading = (isGlobalLoading) => ({
    type: SET_IS_GLOBAL_LOADING,
    payload: { isGlobalLoading },
})

export const setIsPartialLoading = (isPartialLoading) => ({
    type: SET_IS_PARTIAL_LOADING,
    payload: { isPartialLoading },
})

export const setMethods = (newMethod) => ({
    type: SET_METHODS,
    payload: { newMethod },
})

export const setTimeframe = (timeframe) => {
    localStorage.setItem('ga_default_timeframe', timeframe)
    return {
        type: SET_TIMEFRAME,
        payload: { timeframe },
    }
}

export const setTimezone = (timezone) => {
    localStorage.setItem('ga_default_timezone', timezone)
    return {
        type: SET_TIMEZONE,
        payload: { timezone },
    }
}
