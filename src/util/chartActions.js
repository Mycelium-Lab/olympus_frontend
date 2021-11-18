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
    rebasesTimestamps,
}) => {
    const mappedDataSets = await fetchMappedData(
        startTimestamp,
        endTimestamp,
        intervalDiff,
        timeframe,
        timezone,
        shouldTrimEnd,
        methods
    )

    const series = mappedDataSets.map((mappedData, idx) =>
        fillChart(
            charts[idx],
            methods[idx],
            mappedData,
            null, // series are not defined yet
            rebasesTimestamps
        )
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
    let startTimestamp = lastTimestamp - unixDelta * (timesFetchedPrevious + 1)
    let endTimestamp = lastTimestamp - unixDelta * timesFetchedPrevious

    if (timeframe === 0) {
        startTimestamp = moment
            .unix(startTimestamp)
            .utc()
            .subtract(timesFetchedPrevious + 1, 'weeks')
            .startOf('isoWeek')
            .unix()
        endTimestamp = moment
            .unix(endTimestamp)
            .utc()
            .subtract(timesFetchedPrevious + 1, 'weeks')
            .endOf('isoWeek')
            .unix()
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
