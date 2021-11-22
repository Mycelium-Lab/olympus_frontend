import axios from 'axios'
import { TVTimeValueObject } from '../util/tvSeries'

/**
 * @dev : Get stakes (N days)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param days - Number of days
 */
export async function getStakesInfoNDays(startTimestamp, endTime, days) {
    let stakeQuery = `
  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
          id
          usdRate
          amountStaked
          amountUnstaked
          currentStaked
          timestamp
          stakeCount
          unstakeCount
          stakeMax
          unstakeMax
        }
      }
    }
  `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let k = 0; k < stakesData.length; ++k) {
            for (let i = 0; i < stakesData[k].dayStake.length; ++i) {
                let obj = {}
                obj.stakeCount = stakesData[k].dayStake[i].stakeCount
                obj.unstakeCount = stakesData[k].dayStake[i].unstakeCount
                obj.usdRate = stakesData[k].dayStake[i].usdRate
                obj.amountStaked = stakesData[k].dayStake[i].amountStaked
                obj.amountUnstaked = stakesData[k].dayStake[i].amountUnstaked
                obj.timestamp = stakesData[k].dayStake[i].timestamp
                obj.currentStaked = stakesData[k].dayStake[i].currentStaked
                obj.stakeMax = stakesData[k].dayStake[i].stakeMax
                obj.unstakeMax = stakesData[k].dayStake[i].unstakeMax
                stakes.push(obj)
            }
        }

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + days * 86400;
            beginTimestamp < endTime;
            beginTimestamp += days * 86400, endTimestamp += days * 86400
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                usdRate: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                stakeMax: 0,
                unstakeMax: 0,
                stakeAvg: 0,
                unstakeAvg: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount += Number(stakes[j].stakeCount)
                    obj.unstakeCount += Number(stakes[j].unstakeCount)
                    obj.usdRate = Number(stakes[j].usdRate)
                    obj.amountStaked += Number(stakes[j].amountStaked)
                    obj.amountUnstaked += Number(stakes[j].amountUnstaked)
                    obj.currentStaked = Number(stakes[j].currentStaked)
                    if (stakes[j].stakeMax > obj.stakeMax) {
                        obj.stakeMax = Number(stakes[j].stakeMax)
                    }
                    if (stakes[j].unstakeMax > obj.unstakeMax) {
                        obj.unstakeMax = Number(stakes[j].unstakeMax)
                    }
                    obj.stakeAvg = obj.amountStaked / obj.stakeCount
                    obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
                    obj.nettoStaked =
                        stakes[j].amountStaked - stakes[j].amountUnstaked
                    obj.unstakedToStakedPercent =
                        -1 *
                        100 *
                        ((stakes[j].amountUnstaked - stakes[j].amountStaked) /
                            stakes[j].amountUnstaked)
                    obj.unstakedOfTotalStakedPercent =
                        (-1 * 100 * stakes[j].amountUnstaked) /
                        stakes[j].currentStaked
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

/**
 * @dev : Get stakes (N hours)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param hours - Number of hours
 */
export async function getStakesInfoNHours(startTimestamp, endTime, hours) {
    let stakeQuery = `
  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
          hourStake(first: 24, orderBy:timestamp)
          {
            id
            usdRate
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
            stakeMax
            unstakeMax
          }
          
        }
      }
    }
  `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let k = 0; k < stakesData.length; ++k) {
            for (let i = 0; i < stakesData[k].dayStake.length; ++i) {
                for (
                    let j = 0;
                    j < stakesData[k].dayStake[i].hourStake.length;
                    ++j
                ) {
                    let obj = {}
                    obj.stakeCount =
                        stakesData[k].dayStake[i].hourStake[j].stakeCount
                    obj.unstakeCount =
                        stakesData[k].dayStake[i].hourStake[j].unstakeCount
                    obj.usdRate = stakesData[k].dayStake[i].hourStake[j].usdRate
                    obj.amountStaked =
                        stakesData[k].dayStake[i].hourStake[j].amountStaked
                    obj.amountUnstaked =
                        stakesData[k].dayStake[i].hourStake[j].amountUnstaked
                    obj.timestamp =
                        stakesData[k].dayStake[i].hourStake[j].timestamp
                    obj.currentStaked =
                        stakesData[k].dayStake[i].hourStake[j].currentStaked
                    obj.stakeMax =
                        stakesData[k].dayStake[i].hourStake[j].stakeMax
                    obj.unstakeMax =
                        stakesData[k].dayStake[i].hourStake[j].unstakeMax
                    stakes.push(obj)
                }
            }
        }

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + hours * 3600;
            beginTimestamp < endTime;
            beginTimestamp += hours * 3600, endTimestamp += hours * 3600
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                usdRate: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                stakeMax: 0,
                unstakeMax: 0,
                stakeAvg: 0,
                unstakeAvg: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount += Number(stakes[j].stakeCount)
                    obj.unstakeCount += Number(stakes[j].unstakeCount)
                    obj.usdRate = Number(stakes[j].usdRate)
                    obj.amountStaked += Number(stakes[j].amountStaked)
                    obj.amountUnstaked += Number(stakes[j].amountUnstaked)
                    obj.currentStaked = Number(stakes[j].currentStaked)
                    if (stakes[j].stakeMax > obj.stakeMax) {
                        obj.stakeMax = Number(stakes[j].stakeMax)
                    }
                    if (stakes[j].unstakeMax > obj.unstakeMax) {
                        obj.unstakeMax = Number(stakes[j].unstakeMax)
                    }
                    obj.stakeAvg = obj.amountStaked / obj.stakeCount
                    obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
                    obj.nettoStaked =
                        stakes[j].amountStaked - stakes[j].amountUnstaked
                    obj.unstakedToStakedPercent =
                        -1 *
                        100 *
                        ((stakes[j].amountUnstaked - stakes[j].amountStaked) /
                            stakes[j].amountUnstaked)
                    obj.unstakedOfTotalStakedPercent =
                        (-1 * 100 * stakes[j].amountUnstaked) /
                        stakes[j].currentStaked
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

/**
 * @dev : Get stakes (N minutes)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param minutes - Number of minutes
 */
export async function getStakesInfoNMinutes(startTimestamp, endTime, minutes) {
    let stakeQuery = `
  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) 
        {
          hourStake(first: 24, orderBy:timestamp)
          {
            minuteStake(first: 60 orderBy:timestamp)
            {
              id
              usdRate
              amountStaked
              amountUnstaked
              currentStaked
              timestamp
              stakeCount
              unstakeCount
              stakeMax
              unstakeMax  
            }
          }
        }
      }
    }
  `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let k = 0; k < stakesData.length; ++k) {
            for (let i = 0; i < stakesData[k].dayStake.length; ++i) {
                for (
                    let j = 0;
                    j < stakesData[k].dayStake[i].hourStake.length;
                    ++j
                ) {
                    for (
                        let c = 0;
                        c <
                        stakesData[k].dayStake[i].hourStake[j].minuteStake
                            .length;
                        ++c
                    ) {
                        let obj = {}
                        obj.stakeCount =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].stakeCount
                        obj.unstakeCount =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].unstakeCount
                        obj.usdRate =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].usdRate
                        obj.amountStaked =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].amountStaked
                        obj.amountUnstaked =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].amountUnstaked
                        obj.timestamp =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].timestamp
                        obj.currentStaked =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].currentStaked
                        obj.stakeMax =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].stakeMax
                        obj.unstakeMax =
                            stakesData[k].dayStake[i].hourStake[j].minuteStake[
                                c
                            ].unstakeMax
                        stakes.push(obj)
                    }
                }
            }
        }

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + minutes * 60;
            beginTimestamp < endTime;
            beginTimestamp += minutes * 60, endTimestamp += minutes * 60
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                usdRate: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                stakeMax: 0,
                unstakeMax: 0,
                stakeAvg: 0,
                unstakeAvg: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount += Number(stakes[j].stakeCount)
                    obj.unstakeCount += Number(stakes[j].unstakeCount)
                    obj.usdRate = Number(stakes[j].usdRate)
                    obj.amountStaked += Number(stakes[j].amountStaked)
                    obj.amountUnstaked += Number(stakes[j].amountUnstaked)
                    obj.currentStaked = Number(stakes[j].currentStaked)
                    if (stakes[j].stakeMax > obj.stakeMax) {
                        obj.stakeMax = Number(stakes[j].stakeMax)
                    }
                    if (stakes[j].unstakeMax > obj.unstakeMax) {
                        obj.unstakeMax = Number(stakes[j].unstakeMax)
                    }
                    obj.stakeAvg = obj.amountStaked / obj.stakeCount
                    obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
                    obj.nettoStaked =
                        stakes[j].amountStaked - stakes[j].amountUnstaked
                    obj.unstakedToStakedPercent =
                        -1 *
                        100 *
                        ((stakes[j].amountUnstaked - stakes[j].amountStaked) /
                            stakes[j].amountUnstaked)
                    obj.unstakedOfTotalStakedPercent =
                        (-1 * 100 * stakes[j].amountUnstaked) /
                        stakes[j].currentStaked
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

export function mapStakes(stakes) {
    return stakes.reduce(
        (acc, e) => {
            const time = parseInt(e.beginTimestamp)
            acc.staked.push(new TVTimeValueObject(Number(e.amountStaked), time))
            acc.unstaked.push(
                new TVTimeValueObject(-Number(e.amountUnstaked), time)
            )
            acc.currentStaked.push(
                new TVTimeValueObject(Number(e.currentStaked), time)
            )
            acc.currentStakedUsd.push(
                new TVTimeValueObject(
                    Number(e.currentStaked) * Number(e.usdRate),
                    time
                )
            )
            acc.nettoStaked.push(
                new TVTimeValueObject(Number(e.nettoStaked), time)
            )
            acc.unstakedToStakedPercent.push(
                new TVTimeValueObject(
                    Math.abs(Number(e.unstakedToStakedPercent)) === Infinity
                        ? NaN
                        : Number(e.unstakedToStakedPercent),
                    time
                )
            )
            acc.unstakedOfTotalStakedPercent.push(
                new TVTimeValueObject(
                    Math.abs(Number(e.unstakedOfTotalStakedPercent)) ===
                    Infinity
                        ? NaN
                        : Number(e.unstakedOfTotalStakedPercent),
                    time
                )
            )
            acc.stakedMax.push(new TVTimeValueObject(Number(e.stakeMax), time))
            acc.unstakedMax.push(
                new TVTimeValueObject(-Number(e.unstakeMax), time)
            )
            acc.stakedAvg.push(new TVTimeValueObject(Number(e.stakeAvg), time))
            acc.unstakedAvg.push(
                new TVTimeValueObject(-Number(e.unstakeAvg), time)
            )
            acc.stakeCount.push(
                new TVTimeValueObject(Number(e.stakeCount), time)
            )
            acc.unstakeCount.push(
                new TVTimeValueObject(-Number(e.unstakeCount), time)
            )
            return acc
        },
        {
            staked: [],
            unstaked: [],
            currentStaked: [],
            currentStakedUsd: [],
            stakedMax: [],
            unstakedMax: [],
            stakedAvg: [],
            unstakedAvg: [],
            nettoStaked: [],
            unstakedToStakedPercent: [],
            unstakedOfTotalStakedPercent: [],
            stakeCount: [],
            unstakeCount: [],
        }
    )
}

export function getStakesInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getStakesInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getStakesInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getStakesInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getStakesInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getStakesInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getStakesInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getStakesInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getStakesInfoNMinutes(...rest, 1)
        default:
            return
    }
}
