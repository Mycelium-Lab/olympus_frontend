import {
    setIsGlobalLoading,
    setIsPartialLoading,
    setIsRebasesLoading,
    setMethods as _setMethods,
    setTimeframe,
    setTimezone,
    setShouldRebasesLoad,
} from './chartsActions'

const setMethods = (...args) => _setMethods(...args)('dashboard')

export {
    setIsGlobalLoading,
    setIsPartialLoading,
    setIsRebasesLoading,
    setMethods,
    setTimeframe,
    setTimezone,
    setShouldRebasesLoad,
}
