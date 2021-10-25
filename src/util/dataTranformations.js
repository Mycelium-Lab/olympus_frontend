import {
    getStakesInfoDays,
    getStakesInfoHours,
    getStakesInfoMinutes,
    getStakesInfoNHours,
    mapStakes,
} from '../dataFetch/stakes'
import {
    getDepositsInfoDays,
    getDepositsInfoHours,
    getDepositsInfoMinutes,
    getDepositsInfoNHours,
    mapBonds,
} from '../dataFetch/bonds'

import moment from 'moment'

import { methodPropsChartConfigs } from './config'
import { TVTimeValueObject } from './tvSeries'

export const getMappedScData = async (
    startTime,
    endTime,
    method,
    timeframe,
    intervalDiff,
    isInitialload
) => {
    let mappedData

    const typeOfData = methodPropsChartConfigs[method].type
    switch (typeOfData) {
        case 'staking':
            let stakes
            switch (timeframe) {
                case 0:
                    stakes = await getStakesInfoDays(startTime, endTime)
                    break
                case 1:
                    stakes = await getStakesInfoNHours(startTime, endTime, 4)
                    break
                case 2:
                    stakes = await getStakesInfoHours(startTime, endTime)
                    break
                case 3:
                    stakes = await getStakesInfoMinutes(startTime, endTime)
                    break
                default:
                    break
            }
            mappedData = mapStakes(stakes)
            break
        case 'bonds':
            let bonds
            switch (timeframe) {
                case 0:
                    bonds = await getDepositsInfoDays(startTime, endTime)
                    break
                case 1:
                    bonds = await getDepositsInfoNHours(startTime, endTime, 4)
                    break
                case 2:
                    bonds = await getDepositsInfoHours(startTime, endTime)
                    break
                case 3:
                    bonds = await getDepositsInfoMinutes(startTime, endTime)
                    break
                default:
                    break
            }
            mappedData = mapBonds(bonds)
            break
        case 'treasury':
            const data = await methodPropsChartConfigs[method].getDataFunctions[
                timeframe
            ](startTime, endTime)
            const mappedRaw =
                methodPropsChartConfigs[method].mapDataFunction(data)
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
    if (isInitialload) return trimDataSetEnd(mappedData)
    else return mappedData
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
