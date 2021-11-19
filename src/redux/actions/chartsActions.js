import {
    SET_IS_GLOBAL_LOADING,
    SET_IS_PARTIAL_LOADING,
    SET_IS_REBASES_LOADING,
    SET_SHOULD_REBASES_LOAD,
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

export const setIsRebasesLoading = (isRebasesLoading) => ({
    type: SET_IS_REBASES_LOADING,
    payload: { isRebasesLoading },
})

export const setMethods = (newMethod) => ({
    type: SET_METHODS,
    payload: { newMethod },
})

export const setTimeframe = (timeframe) => ({
    type: SET_TIMEFRAME,
    payload: { timeframe },
})

export const setTimezone = (timezone) => ({
    type: SET_TIMEZONE,
    payload: { timezone },
})

export const setShouldRebasesLoad = (shouldRebasesLoad) => {
    return {
        type: SET_SHOULD_REBASES_LOAD,
        payload: { shouldRebasesLoad },
    }
}