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
    delta,
    method,
    timeframe,
    intervalDiff
) => {
    let mappedData

    const typeOfData = methodPropsChartConfigs[method].type
    switch (typeOfData) {
        case 'staking':
            let stakes
            switch (timeframe) {
                case 0:
                    stakes = await getStakesInfoDays(startTime, delta)
                    break
                case 1:
                    stakes = await getStakesInfoHours(startTime, delta)
                    break
                case 2:
                    stakes = await getStakesInfoMinutes(startTime, delta)
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
                    bonds = await getDepositsInfoDays(startTime, delta)
                    break
                case 1:
                    bonds = await getDepositsInfoHours(startTime, delta)
                    break
                case 2:
                    bonds = await getDepositsInfoMinutes(startTime, delta)
                    break
                default:
                    break
            }
            mappedData = mapBonds(bonds)
            break
        case 'treasury':
            // TBD: create a normal endTime solution
            const endTime =
                timeframe === 0
                    ? moment(startTime * 1000)
                          .add(delta - 2, 'days')
                          .unix()
                    : moment(startTime * 1000)
                          .add(delta, 'days')
                          .unix()
            const data = await methodPropsChartConfigs[method].getDataFunctions[
                timeframe
            ](startTime, endTime)
            const mappedRaw =
                methodPropsChartConfigs[method].mapDataFunction(data)
            mappedData = completeDataSet(
                mappedRaw,
                startTime,
                endTime,
                intervalDiff
            )
            break
        default:
            break
    }
    return mappedData
}

export const completeDataSet = (dataSet, startTime, endTime, intervalDiff) => {
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

            acc[key] = [...[...filler].reverse(), ...dataSet[key]]
            return acc
        }, {})
    } else if (lengthDiff < 0) {
        return Object.keys(dataSet).reduce((acc, key) => {
            acc[key] = dataSet[key].slice(0, dataSet[key].length + lengthDiff)
            return acc
        }, {})
    } else return dataSet
}
