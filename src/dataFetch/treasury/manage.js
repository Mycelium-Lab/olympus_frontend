import axios from 'axios'
import { token } from './config.js'
import { getTokens } from './getTokens.js'
import { TVValueTimeObject } from '../../util/tvSeries.js'

const day = 60 * 60 * 24

const dayQuery = `
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       
        id
        amount
        timestamp
        sender
        sumAmount
       
     }
   }
}
  `

export async function getManageInfoNDays(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForDays(
            await getManageByDaysFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForNDays(
                bigArray[i].array,
                startTimestamp,
                endTimestamp,
                n
            )
        }

        return bigArray
    } catch (err) {
        console.log(err)
    }
}

async function getManageByDaysFromGraph() {
    try {
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: dayQuery,
            },
        })
        return dayData.data.data.manageYearEntities
    } catch (err) {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
async function reformToBigArrayForDays(days) {
    let out = []
    let tokens = await getTokens()
    for (let i = 0; i < tokens.length; i++) {
        out.push({
            token: tokens[i],
            array: [],
        })
    }
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayManage.length; j++) {
            for (let m = 0; m < tokens.length; m++) {
                if (days[i].dayManage[j].id.slice(0, 42) == tokens[m]) {
                    out[m].array.push(days[i].dayManage[j])
                }
            }
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
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
}

const hour = 60 * 60

const hourQuery = `
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       hourManage(first:24 orderBy:timestamp){
       
           id
           amount
           timestamp
           sender
           sumAmount
        
       }
     }
   }
}
`

export async function getManageInfoNHours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getManageByHoursFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForNHours(
                bigArray[i].array,
                startTimestamp,
                endTimestamp,
                n
            )
        }

        return bigArray
    } catch (err) {
        console.log(err)
    }
}

async function getManageByHoursFromGraph() {
    try {
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: hourQuery,
            },
        })

        return hourData.data.data.manageYearEntities
    } catch (err) {
        console.log(err)
    }
}
/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
async function reformToBigArrayForHour(days) {
    let out = []
    let tokens = await getTokens()
    for (let i = 0; i < tokens.length; i++) {
        out.push({
            token: tokens[i],
            array: [],
        })
    }

    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayManage.length; j++) {
            for (let k = 0; k < days[i].dayManage[j].hourManage.length; k++) {
                for (let m = 0; m < tokens.length; m++) {
                    if (
                        days[i].dayManage[j].hourManage[k].id.slice(0, 42) ==
                        tokens[m]
                    ) {
                        out[m].array.push(days[i].dayManage[j].hourManage[k])
                    }
                }
            }
        }
    }
    return out
}

function fillBigArrayForNHours(stakes, startTimestamp, endTime, hours) {
    let data = []
    for (
        let beginTimestamp = startTimestamp,
            endTimestamp = startTimestamp + hours * 3600;
        beginTimestamp < endTime;
        beginTimestamp += hours * 3600, endTimestamp += hours * 3600
    ) {
        let obj = {
            timestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            amount: 0,
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
}

const minute = 60

const minuteQuery = `
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       hourManage(first:24 orderBy:timestamp){
         minuteManage(first:60 orderBy:timestamp){
           id
           amount
           timestamp
           sender
           sumAmount
         }
       }
     }
   }
}
`

export async function getManageInfoNMinutes(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForMinutes(
            await getManageByMinutesFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForNMinutes(
                bigArray[i].array,
                startTimestamp,
                endTimestamp,
                n
            )
        }

        return bigArray
    } catch (err) {
        console.log(err)
    }
}

async function getManageByMinutesFromGraph() {
    try {
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: minuteQuery,
            },
        })
        return minuteData.data.data.manageYearEntities
    } catch (err) {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
async function reformToBigArrayForMinutes(days) {
    let out = []
    let tokens = await getTokens()
    for (let i = 0; i < tokens.length; i++) {
        out.push({
            token: tokens[i],
            array: [],
        })
    }

    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayManage.length; j++) {
            for (let k = 0; k < days[i].dayManage[j].hourManage.length; k++) {
                for (
                    let l = 0;
                    l < days[i].dayManage[j].hourManage[k].minuteManage.length;
                    l++
                ) {
                    for (let m = 0; m < tokens.length; m++) {
                        if (
                            days[i].dayManage[j].hourManage[k].minuteManage[
                                l
                            ].id.slice(0, 42) == tokens[m]
                        ) {
                            out[m].array.push(
                                days[i].dayManage[j].hourManage[k].minuteManage[
                                    l
                                ]
                            )
                        }
                    }
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
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
}

export function getManageInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getManageInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getManageInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getManageInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getManageInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getManageInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getManageInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getManageInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getManageInfoNMinutes(...rest, 1)
        default:
            return
    }
}

export function mapManage(manage, token) {
    return manage
        .filter((i) => i.token === token)[0]
        .array.reduce(
            (acc, e) => {
                const time = parseInt(e.timestamp)
                acc.amount.push(new TVValueTimeObject(Number(e.amount), time))
                acc.sumAmount.push(
                    new TVValueTimeObject(Number(e.sumAmount), time)
                )
                return acc
            },
            {
                amount: [],
                sumAmount: [],
            }
        )
}
