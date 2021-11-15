import {
    getMappedScData,
    mergeObjectsArrays,
    mergeObjectsArraysOverrideTime,
} from './dataTranformations'

import { fillChart, baseGranularityUnix } from './config'

import moment from 'moment'

const fetchMappedData = (
    startTimestamp,
    endTimestamp,
    intervalDiff,
    timeframe,
    timezone,
    shouldTrimEnd,
    methods
) => {
    const fetchPromises = methods.map((method) =>
        getMappedScData(
            startTimestamp,
            endTimestamp,
            method,
            timeframe,
            intervalDiff,
            timezone,
            shouldTrimEnd
        )
    )

    return Promise.all(fetchPromises)
}

export const initialDataFetch = async ({
    startTimestamp,
    endTimestamp,
    intervalDiff,
    timeframe,
    timezone,
    shouldTrimEnd,
    methods,
    charts,
}) => {
    let mappedDataSets = await fetchMappedData(
        startTimestamp,
        endTimestamp,
        intervalDiff,
        timeframe,
        timezone,
        shouldTrimEnd,
        methods
    )

    let series = mappedDataSets.map((mappedData, idx) =>
        fillChart(charts[idx], methods[idx], mappedData)
    )

    return [mappedDataSets, series]
}

export const previousDataFetch = async ({
    lastTimestamp,
    timesFetchedPrevious,
    fetchBackDelta,
    intervalDiff,
    timeframe,
    timezone,
    shouldTrimEnd,
    methods,
    charts,
    oldMappedDataSets,
    oldSeries,
}) => {
    const unixDelta = fetchBackDelta * baseGranularityUnix
    let startTimestamp = lastTimestamp - unixDelta * timesFetchedPrevious
    let endTimestamp = startTimestamp - unixDelta

    if (timeframe === 0) {
        startTimestamp = moment
            .unix(startTimestamp)
            .utc()
            .subtract(1, 'days')
            .startOf('isoWeek')
            .unix()
        endTimestamp = moment.unix(endTimestamp).utc().endOf('isoWeek').unix()
    }

    let mappedDataSets = await fetchMappedData(
        startTimestamp,
        endTimestamp,
        intervalDiff,
        timeframe,
        timezone,
        shouldTrimEnd,
        methods
    )

    mappedDataSets = mappedDataSets.map((mappedData, idx) =>
        mergeObjectsArrays(oldMappedDataSets[idx], mappedData)
    )
    let series = mappedDataSets.map((mappedData, idx) =>
        fillChart(charts[idx], methods[idx], mappedData, oldSeries[idx])
    )

    return [mappedDataSets, series]
}

export const updateDataFetch = async ({
    intervalDiff,
    timeframe,
    timezone,
    shouldTrimEnd,
    methods,
    charts,
    oldMappedDataSets,
    oldSeries,
}) => {
    // for intervals > 1D (e.g., 1W), set larger boundaries for incoming queries
    const boundaryTimeframeType = timeframe === 0 ? 'isoWeek' : 'day'
    const startTimestamp = moment().utc().startOf(boundaryTimeframeType).unix()
    const endTimestamp = moment().utc().endOf(boundaryTimeframeType).unix()

    let mappedDataSets = await fetchMappedData(
        startTimestamp,
        endTimestamp,
        intervalDiff,
        timeframe,
        timezone,
        shouldTrimEnd,
        methods
    )

    mappedDataSets = mappedDataSets.map((newMappedData, idx) =>
        mergeObjectsArraysOverrideTime(oldMappedDataSets[idx], newMappedData)
    )
    let series = mappedDataSets.map((mappedData, idx) =>
        fillChart(charts[idx], methods[idx], mappedData, oldSeries[idx])
    )

    return [mappedDataSets, series]
}
