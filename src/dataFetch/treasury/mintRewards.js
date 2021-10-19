import axios from 'axios'
import { token } from './config.js'
import { getWholePeriodOfTime } from './utils/date.js'
import { TVTimeValueObject } from '../../util/tvSeries.js'

const day = 60 * 60 * 24

const dayQuery = `
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        timestamp
        amount
        recipient
        caller
      }
    }
  }
  `

export async function getMintRewardsByDay(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        return fillBigArrayForDays(
            reformToBigArrayForDays(await getTotalReserveByDaysFromGraph()),
            startTimestamp,
            endTimestamp
        )
    } catch (err) {
        console.log(err)
    }
}

async function getTotalReserveByDaysFromGraph() {
    try {
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: dayQuery,
            },
        })
        return dayData.data.data.yearRewardsMintedEntities
    } catch (err) {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
function reformToBigArrayForDays(days) {
    let out = []
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayMint.length; j++) {
            out.push(days[i].dayMint[j])
        }
    }
    return out
}

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForDays(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            day
        )
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            day
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                amount: bigArray[i - 1].amount,
                timestamp: timestamp,
                recipient: bigArray[i - 1].recipient,
                caller: bigArray[i - 1].caller,
            })
        }
        timestamp += day
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                out.push({
                    amount: 0,
                    timestamp: timestamp,
                    recipient: [],
                    caller: [],
                })
            }
            timestamp += day
        }
    }
    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            day
        ),
        amount: bigArray[bigArray.length - 1].amount,
        recipient: bigArray[bigArray.length - 1].recipient,
        caller: bigArray[bigArray.length - 1].caller,
    })
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        day
    )
    timestamp += day
    while (timestamp <= endTimestamp) {
        out.push({
            timestamp: timestamp,
            amount: 0,
            timestamp: timestamp,
            recipient: [],
            caller: [],
        })
        timestamp += day
    }
    return out
}

const hour = 60 * 60

const hourQuery = `
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        hourMint(first:24 orderBy:timestamp){
         
            timestamp
            amount
            recipient
            caller
          
        }
      }
    }
  }
  `

export async function getMintRewardsByHour(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        return fillBigArrayForHours(
            reformToBigArrayForHours(await getTotalReserveByHoursFromGraph()),
            startTimestamp,
            endTimestamp
        )
    } catch (err) {
        console.log(err)
    }
}

export async function getMintRewardsBy4Hours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        return fillBigArrayFor4Hours(
            reformToBigArrayForHours(await getTotalReserveByHoursFromGraph()),
            startTimestamp,
            endTimestamp
        )
    } catch (err) {
        console.log(err)
    }
}

async function getTotalReserveByHoursFromGraph() {
    try {
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: hourQuery,
            },
        })
        return hourData.data.data.yearRewardsMintedEntities
    } catch (err) {
        console.log(err)
    }
}
/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
function reformToBigArrayForHours(days) {
    let out = []
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayMint.length; j++) {
            for (let k = 0; k < days[i].dayMint[j].hourMint.length; k++) {
                out.push(days[i].dayMint[j].hourMint[k])
            }
        }
    }
    return out
}

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForHours(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                amount: bigArray[i - 1].amount,
                timestamp: timestamp,
                recipient: bigArray[i - 1].recipient,
                caller: bigArray[i - 1].caller,
            })
        }
        timestamp += hour
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                out.push({
                    amount: 0,
                    timestamp: timestamp,
                    recipient: [],
                    caller: [],
                })
            }
            timestamp += hour
        }
    }
    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            hour
        ),
        amount: bigArray[bigArray.length - 1].amount,
        recipient: bigArray[bigArray.length - 1].recipient,
        caller: bigArray[bigArray.length - 1].caller,
    })
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        hour
    )
    timestamp += hour
    while (timestamp <= endTimestamp) {
        out.push({
            timestamp: timestamp,
            amount: 0,
            timestamp: timestamp,
            recipient: [],
            caller: [],
        })
        timestamp += hour
    }

    return out
}

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayFor4Hours(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let fragment = 0
    let recipient = []
    let caller = []
    let amount = 0
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        amount += bigArray[i - 1].amount
        caller.concat(bigArray[i - 1].caller)
        recipient.concat(bigArray[i - 1].recipient)
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            if (fragment % 4 == 3) {
                out.push({
                    amount: bigArray[i - 1].amount,
                    timestamp: timestamp,
                    recipient: bigArray[i - 1].recipient,
                    caller: bigArray[i - 1].caller,
                })
                amount = 0
                recipient = []
                caller = []
            }
        }
        timestamp += hour
        fragment++
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                if (fragment % 4 == 3) {
                    out.push({
                        amount: amount,
                        timestamp: timestamp,
                        recipient: recipient,
                        caller: caller,
                    })
                    amount = 0
                    recipient = []
                    caller = []
                }
            }
            timestamp += hour
            fragment++
        }
    }
    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            4 * hour
        ),
        amount: bigArray[bigArray.length - 1].amount,
        recipient: bigArray[bigArray.length - 1].recipient,
        caller: bigArray[bigArray.length - 1].caller,
    })
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        4 * hour
    )
    timestamp += 4 * hour
    while (timestamp <= endTimestamp) {
        out.push({
            timestamp: timestamp,
            amount: 0,
            timestamp: timestamp,
            recipient: [],
            caller: [],
        })
        timestamp += 4 * hour
    }
    return out
}

const minute = 60

const minuteQuery = `
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        hourMint(first:24 orderBy:timestamp){
          minuteMint(first:60 orderBy:timestamp){
            timestamp
            amount
            recipient
            caller
          }
        }
      }
    }
  }
  `

export async function getMintRewardsByMinute(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        return fillBigArrayForMinutes(
            reformToBigArrayForMinutes(
                await getTotalReserveByMinutesFromGraph()
            ),
            startTimestamp,
            endTimestamp
        )
    } catch (err) {
        console.log(err)
    }
}

async function getTotalReserveByMinutesFromGraph() {
    try {
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: minuteQuery,
            },
        })
        return minuteData.data.data.yearRewardsMintedEntities
    } catch (err) {
        console.log(err)
    }
}

function reformToBigArrayForMinutes(days) {
    let out = []
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayMint.length; j++) {
            for (let k = 0; k < days[i].dayMint[j].hourMint.length; k++) {
                for (
                    let l = 0;
                    l < days[i].dayMint[j].hourMint[k].minuteMint.length;
                    l++
                ) {
                    out.push(days[i].dayMint[j].hourMint[k].minuteMint[l])
                }
            }
        }
    }
    return out
}
/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForMinutes(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            minute
        )
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            minute
        )
        out.push({
            amount: bigArray[i - 1].amount,
            timestamp: timestamp,
            recipient: bigArray[i - 1].recipient,
            caller: bigArray[i - 1].caller,
        })
        timestamp += minute
        while (timestamp < nextTimestamp) {
            out.push({
                amount: 0,
                timestamp: timestamp,
                recipient: [],
                caller: [],
            })
            timestamp += minute
        }
    }
    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            minute
        ),
        amount: bigArray[bigArray.length - 1].amount,
        recipient: bigArray[bigArray.length - 1].recipient,
        caller: bigArray[bigArray.length - 1].caller,
    })
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        minute
    )
    timestamp += minute
    while (timestamp <= endTimestamp) {
        out.push({
            timestamp: timestamp,
            amount: 0,
            timestamp: timestamp,
            recipient: [],
            caller: [],
        })
        timestamp += minute
    }

    return out
}

export function mapMintRewards(minted_rewards) {
    return minted_rewards.reduce(
        (acc, e) => {
            const time = parseInt(e.timestamp)
            acc.minted_rewards.push(
                new TVTimeValueObject(Number(e.amount), time)
            )
            return acc
        },
        {
            minted_rewards: [],
        }
    )
}
