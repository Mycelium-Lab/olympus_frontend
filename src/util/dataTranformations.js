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

import { methodPropsChartConfigs } from './config'

export const getMappedScData = async (startTime, delta, method, timeframe) => {
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
                case 1:
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
        // case 'treasury':
        //     mappedData = await methodPropsChartConfigs[method].getMappedData(
        //         startTime,
        //         delta
        //     )
        default:
            break
    }
    return mappedData
}
