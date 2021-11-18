import { getRebasesTimestamps } from '../../dataFetch/rebases'

import {
    SET_IS_GLOBAL_LOADING,
    SET_IS_PARTIAL_LOADING,
    SET_IS_REBASES_LOADING,
    SET_SHOULD_REBASES_LOAD,
    SET_REBASES,
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

export const setRebases = () => (dispatch, getState) => {
    const {
        ga: { shouldRebasesLoad },
    } = getState()

    dispatch(setIsGlobalLoading(true))

    if (!shouldRebasesLoad) {
        localStorage.setItem('ga_default_should_rebases_load', true)
        dispatch({
            type: SET_SHOULD_REBASES_LOAD,
            payload: { shouldRebasesLoad: true },
        })
        getRebasesTimestamps()
            .then((rebases) => {
                dispatch({
                    type: SET_REBASES,
                    payload: { rebases },
                })
                // dispatch(setIsGlobalLoading(false))
            })
            .catch((_) => {
                localStorage.setItem('ga_default_should_rebases_load', false)
                dispatch({
                    type: SET_SHOULD_REBASES_LOAD,
                    payload: { shouldRebasesLoad: false },
                })
                // dispatch(setIsGlobalLoading(false))
            })
    } else {
        localStorage.setItem('ga_default_should_rebases_load', false)
        dispatch({
            type: SET_SHOULD_REBASES_LOAD,
            payload: { shouldRebasesLoad: false },
        })

        dispatch({
            type: SET_REBASES,
            payload: { rebases: [] },
        })
    }
}
