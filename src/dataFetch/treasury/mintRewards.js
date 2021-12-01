import axios from 'axios'
import { token } from './config.js'
import { TVValueTimeObject } from '../../util/tvSeries.js'

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

export async function getMintRewardsInfoNDays(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNDays(
            reformToBigArrayForDays(await getMintRewardsByDaysFromGraph()),
            startTimestamp,
            endTimestamp,
            n
        )
    } catch (err) {
        console.log(err)
    }
}

async function getMintRewardsByDaysFromGraph() {
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

function fillBigArrayForNDays(stakes, startTimestamp, endTime, days) {
    let data = []
    for (
        let beginTimestamp = startTimestamp,
            endTimestamp = startTimestamp + days * day;
        beginTimestamp < endTime;
        beginTimestamp += days * day, endTimestamp += days * day
    ) {
        let obj = {
            timestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            amount: 0,
            recipient: [],
            caller: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.recipient.concat(stakes[j].recipient)
                obj.caller.concat(stakes[j].caller)
            }
        }
        data.push(obj)
    }
    return data
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

export async function getMintRewardsInfoNHours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNHours(
            reformToBigArrayForHours(await getMintRewardsByHoursFromGraph()),
            startTimestamp,
            endTimestamp,
            n
        )
    } catch (err) {
        console.log(err)
    }
}

async function getMintRewardsByHoursFromGraph() {
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

function fillBigArrayForNHours(stakes, startTimestamp, endTime, hours) {
    let data = []
    for (
        let beginTimestamp = startTimestamp,
            endTimestamp = startTimestamp + hours * hour;
        beginTimestamp < endTime;
        beginTimestamp += hours * hour, endTimestamp += hours * hour
    ) {
        let obj = {
            timestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            amount: 0,
            recipient: [],
            caller: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.recipient.concat(stakes[j].recipient)
                obj.caller.concat(stakes[j].caller)
            }
        }
        data.push(obj)
    }
    return data
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

export async function getMintRewardsInfoNMinutes(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNMinutes(
            reformToBigArrayForMinutes(
                await getMintRewardsByMinutesFromGraph()
            ),
            startTimestamp,
            endTimestamp,
            n
        )
    } catch (err) {
        console.log(err)
    }
}

async function getMintRewardsByMinutesFromGraph() {
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

function fillBigArrayForNMinutes(stakes, startTimestamp, endTime, minutes) {
    let data = []
    for (
        let beginTimestamp = startTimestamp,
            endTimestamp = startTimestamp + minutes * minute;
        beginTimestamp < endTime;
        beginTimestamp += minutes * minute, endTimestamp += minutes * minute
    ) {
        let obj = {
            timestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            amount: 0,
            recipient: [],
            caller: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.recipient.concat(stakes[j].recipient)
                obj.caller.concat(stakes[j].caller)
            }
        }
        data.push(obj)
    }
    return data
}

export function getMintRewardsInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getMintRewardsInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getMintRewardsInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getMintRewardsInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getMintRewardsInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getMintRewardsInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getMintRewardsInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getMintRewardsInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getMintRewardsInfoNMinutes(...rest, 1)
        default:
            return
    }
}

export function mapMintRewards(minted_rewards) {
    return minted_rewards.reduce(
        (acc, e) => {
            const time = parseInt(e.timestamp)
            acc.minted_rewards.push(
                new TVValueTimeObject(Number(e.amount), time)
            )
            return acc
        },
        {
            minted_rewards: [],
        }
    )
}
