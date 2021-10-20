import {
    getStakesInfoDays,
    getStakesInfoHours,
    getStakesInfoMinutes,
    mapStakes,
} from '../dataFetch/stakes'
import {
    getDepositsInfoDays,
    getDepositsInfoHours,
    getDepositsInfoMinutes,
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
                    stakes = await getStakesInfoHours(startTime, endTime)
                    break
                case 2:
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
                    bonds = await getDepositsInfoHours(startTime, endTime)
                    break
                case 2:
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
    if (isInitialload) return completeDataSetEnd(mappedData)
    else return completeDataSetEnd(mappedData)
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

export const completeDataSetEnd = (dataSet) => {
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
