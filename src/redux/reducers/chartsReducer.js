import {
    SET_IS_GLOBAL_LOADING,
    SET_IS_PARTIAL_LOADING,
    SET_IS_REBASES_LOADING,
    SET_SHOULD_REBASES_LOAD,
    SET_METHODS,
    SET_TIMEFRAME,
    SET_TIMEZONE,
} from '../types'
import { v4 } from 'uuid'

const setMethodsState = (currentMethods, newMethod, maxMethodsLength) => {
    if (newMethod.hasOwnProperty('id')) {
        return currentMethods.filter((e) => e.id !== newMethod.id)
    } else {
        if (currentMethods.length <= maxMethodsLength - 1) {
            return [...currentMethods, { ...newMethod, id: v4() }] // add an id if the method is new
        } else return currentMethods
    }
}

export default function (state = {}, action) {
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
        case SET_IS_REBASES_LOADING:
            return {
                ...state,
                isRebasesLoading: action.payload.isRebasesLoading,
            }
        case SET_SHOULD_REBASES_LOAD:
            return {
                ...state,
                shouldRebasesLoad: action.payload.shouldRebasesLoad,
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
