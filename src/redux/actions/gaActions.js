import {
    setIsGlobalLoading,
    setIsPartialLoading,
    setIsRebasesLoading,
    setMethods,
    setTimeframe as _setTimeframe,
    setTimezone as _setTimezone,
    setShouldRebasesLoad as _setShouldRebasesLoad,
} from './chartsActions'

const setTimeframe = (timeframe) => {
    localStorage.setItem('ga_default_timeframe', timeframe)
    return _setTimeframe(timeframe)
}

const setTimezone = (timezone) => {
    localStorage.setItem('ga_default_timezone', timezone)
    return _setTimezone(timezone)
}

const setShouldRebasesLoad = (shouldRebasesLoad) => {
    localStorage.setItem('ga_default_should_rebases_load', shouldRebasesLoad)
    return _setShouldRebasesLoad(shouldRebasesLoad)
}

export {
    setIsGlobalLoading,
    setIsPartialLoading,
    setIsRebasesLoading,
    setMethods,
    setTimeframe,
    setTimezone,
    setShouldRebasesLoad,
}
