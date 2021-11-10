import { getStakesInfoFunction, mapStakes } from '../dataFetch/stakes'
import { getBondsInfoFunction, mapBonds } from '../dataFetch/bonds'
import { getRebasesInfoFunction, mapRebases } from '../dataFetch/rebases'

import { getPairsInfoFunction, mapPairs } from '../dataFetch/pairs'

import moment from 'moment'

import { methodPropsChartConfigs } from './config'
import { TVTimeValueObject } from './tvSeries'

import timezones from './timezones'

export const getMappedScData = async (
    startTime,
    endTime,
    method,
    timeframe,
    intervalDiff,
    timezoneIndex,
    shouldTrimEnd
) => {
    let data, mappedData

    const typeOfData = method.type
    switch (typeOfData) {
        case 'dex':
            const getPairsInfo = getPairsInfoFunction(timeframe)
            data = await getPairsInfo(startTime, endTime, 'OHM', 'DAI')
            mappedData = mapPairs(data)
            break
        case 'staking':
            const getStakesInfo = getStakesInfoFunction(timeframe)
            data = await getStakesInfo(startTime, endTime)
            mappedData = mapStakes(data)
            break
        case 'rebases':
            const getRebasesInfo = getRebasesInfoFunction(timeframe)
            data = await getRebasesInfo(startTime, endTime)
            mappedData = mapRebases(data)
            break
        case 'bonds':
            const getBondsInfo = getBondsInfoFunction(timeframe)
            data = await getBondsInfo(startTime, endTime)
            mappedData = mapBonds(data)
            break
        case 'treasury':
            data = await methodPropsChartConfigs[method.type][
                method.orderNumber
            ].getDataFunctions[timeframe](startTime, endTime)
            const mappedRaw =
                methodPropsChartConfigs[method.type][
                    method.orderNumber
                ].mapDataFunction(data)
            mappedData = completeDataSetStart(
                mappedRaw,
                startTime,
                endTime,
                intervalDiff
            )
            break
        default:
            break
    }
    return shouldTrimEnd
        ? transformTimezone(trimDataSetEnd(mappedData), timezoneIndex)
        : transformTimezone(mappedData, timezoneIndex)
}

export const completeDataSetStart = (
    dataSet,
    startTime,
    endTime,
    intervalDiff
) => {
    // TBD: remove temporary Math.ceil solution
    const expectedLength = Math.ceil((endTime - startTime) / intervalDiff)
    const realLength = Object.values(dataSet)[0].length
    const lengthDiff = expectedLength - realLength
    if (lengthDiff > 0) {
        return Object.keys(dataSet).reduce((acc, key) => {
            let currentTimeDifference = endTime - intervalDiff * realLength

            const filler = Array.from(Array(lengthDiff).keys()).map((_) => {
                const obj = new TVTimeValueObject(0, currentTimeDifference)
                currentTimeDifference -= intervalDiff
                return obj
            })

            acc[key] = [
                ...[...filler].reverse(),
                ...dataSet[key].slice(0, dataSet[key].length - 1),
            ]
            return acc
        }, {})
    } else if (lengthDiff < 0) {
        return Object.keys(dataSet).reduce((acc, key) => {
            acc[key] = dataSet[key].slice(0, dataSet[key].length + lengthDiff)
            return acc
        }, {})
    } else return dataSet
}

export const trimDataSetEnd = (dataSet) => {
    const now = moment.utc().unix()
    return Object.keys(dataSet).reduce((acc, key) => {
        let breakIndex = dataSet[key].length
        for (let i = dataSet[key].length - 1; i >= 0; i--) {
            if (now < dataSet[key][i].time) {
                breakIndex = i
            } else {
                break
            }
        }
        acc[key] = dataSet[key].slice(0, breakIndex)
        return acc
    }, {})
}

export const mergeObjectsArrays = (oldDataSet, newDataSet) => {
    return Object.keys(oldDataSet).reduce((acc, key) => {
        acc[key] = [...newDataSet[key], ...oldDataSet[key]]
        return acc
    }, {})
}

export const mergeObjectsArraysOverrideTime = (oldDataSet, newDataSet) => {
    return Object.keys(oldDataSet).reduce((acc, key) => {
        let breakIndex = newDataSet[key].length
        const lastTimestamp = oldDataSet[key][oldDataSet[key].length - 1].time
        for (let i = newDataSet[key].length - 1; i >= 0; i--) {
            if (newDataSet[key][i].time === lastTimestamp) {
                breakIndex = i
                break
            }
        }

        acc[key] = [
            ...oldDataSet[key].slice(0, oldDataSet[key].length - 1),
            ...newDataSet[key].slice(breakIndex, newDataSet[key].length),
        ]
        return acc
    }, {})
}

export const transformTimezone = (dataSet, timezoneIndex = 0) => {
    const { offset } = timezones[timezoneIndex]
    return Object.keys(dataSet).reduce((acc, key) => {
        acc[key] = dataSet[key].map((e) => ({
            ...e,
            time: e.time + offset * 3600,
        }))
        return acc
    }, {})
}

export const dateFormatter = (date) => {
    return '(' + moment.utc(date).local().format('YY-MM-DD hh:mm:ss') + ')'
}
