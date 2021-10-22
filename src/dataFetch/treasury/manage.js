import axios from 'axios'
import { token } from './config.js'
import { getWholePeriodOfTime } from './utils/date.js'
import { getTokens } from './getTokens.js'
import { TVTimeValueObject } from '../../util/tvSeries.js'

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

export async function getManageByDay(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForDays(
            await getManageByDaysFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForDays(
                bigArray[i].array,
                startTimestamp,
                endTimestamp
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

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForDays(bigArray, startTimestamp, endTimestamp) {
    let out = []

    if (bigArray.length == 0) {
        return out
    }

    if (bigArray.length == 1) {
        out.push({
            timestamp: getWholePeriodOfTime(
                parseInt(bigArray[bigArray.length - 1].timestamp),
                day
            ),
            amount: bigArray[0].amount,
            sender: bigArray[0].sender,
            sumAmount: bigArray[0].sumAmount,
        })
        return out
    }
    let j = 0
    while (bigArray.length > j && bigArray[j].timestamp < startTimestamp) j++
    if (j != 0 && bigArray[j - 1].timestamp < startTimestamp) {
        let timestamp = getWholePeriodOfTime(startTimestamp, day)
        timestamp += day
        while (timestamp <= endTimestamp) {
            out.push({
                timestamp: timestamp,
                amount: 0,
                sender: [],
                sumAmount: bigArray[bigArray.length - 1].sumAmount,
            })
            timestamp += day
        }
        return out
    }
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            day
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            day
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                timestamp: timestamp,
                amount: bigArray[i - 1].amount,
                sender: bigArray[i - 1].sender,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += day
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    amount: 0,
                    sender: [],
                    sumAmount: bigArray[i - 1].sumAmount,
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
        sender: bigArray[bigArray.length - 1].sender,
        sumAmount: bigArray[bigArray.length - 1].sumAmount,
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
            sender: [],
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += day
    }
    return out
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

export async function getManageByHour(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getManageByHoursFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForHours(
                bigArray[i].array,
                startTimestamp,
                endTimestamp
            )
        }

        return bigArray
    } catch (err) {
        console.log(err)
    }
}

export async function getManageBy4Hours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getManageByHoursFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayFor4Hours(
                bigArray[i].array,
                startTimestamp,
                endTimestamp
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

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForHours(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0
    if (bigArray.length == 0) {
        return out
    }
    if (bigArray.length == 1) {
        out.push({
            timestamp: bigArray[0].timestamp,
            amount: bigArray[0].amount,
            sender: bigArray[0].sender,
            sumAmount: bigArray[0].sumAmount,
        })
        return out
    }
    while (bigArray.length > j && bigArray[j].timestamp < startTimestamp) j++
    if (bigArray[0].timestamp > startTimestamp) {
        let timestamp = getWholePeriodOfTime(startTimestamp, 4 * hour)
        while (timestamp <= bigArray[0].timestamp) {
            out.push({
                timestamp,
                amount: 0,
                sender: [],
                sumAmount: 0,
            })
            timestamp += 4 * hour
        }
    }
    if (j != 0 && bigArray[j - 1].timestamp < startTimestamp) {
        let timestamp = getWholePeriodOfTime(startTimestamp, hour)
        timestamp += hour
        while (timestamp <= endTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    amount: 0,
                    sender: [],
                    sumAmount: bigArray[bigArray.length - 1].sumAmount,
                })
            }
            timestamp += hour
        }
        return out
    }
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                timestamp: timestamp,
                amount: bigArray[i - 1].amount,
                sender: bigArray[i - 1].sender,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += hour
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    amount: 0,
                    sender: [],
                    sumAmount: bigArray[i - 1].sumAmount,
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
        sender: bigArray[bigArray.length - 1].sender,

        sumAmount: bigArray[bigArray.length - 1].sumAmount,
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
            sender: [],
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
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
    let fragment = 0
    let amount = 0
    let sender = []
    let out = []
    let j = 0

    if (bigArray.length == 0) {
        return out
    }
    if (bigArray.length == 1) {
        out.push({
            timestamp: bigArray[0].timestamp,
            amount: bigArray[0].amount,
            sender: bigArray[0].sender,
            sumAmount: bigArray[0].sumAmount,
        })
        return out
    }
    while (bigArray.length > j && bigArray[j].timestamp < startTimestamp) j++
    if (bigArray[0].timestamp > startTimestamp) {
        let timestamp = getWholePeriodOfTime(startTimestamp, 4 * hour)
        while (timestamp <= bigArray[0].timestamp) {
            out.push({
                timestamp,
                amount: 0,
                sender: [],
                sumAmount: 0,
            })
            timestamp += 4 * hour
        }
    }

    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        amount += bigArray[i - 1].amount
        sender = sender.concat(bigArray[i - 1].sender)
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            if (out.length > 0 && timestamp == out[out.length - 1].timestamp) {
                out[out.length - 1].amount += amount
                out[out.length - 1].sender.concat(sender)
                out[out.length - 1].sumAmount = bigArray[i - 1].sumAmount
                amount = 0
                sender = []
                continue
            }
            if (timestamp % (4 * hour) == 0) {
                out.push({
                    timestamp: timestamp,
                    amount: bigArray[i - 1].amount,
                    sender: bigArray[i - 1].sender,
                    sumAmount: bigArray[i - 1].sumAmount,
                })
                amount = 0
                sender = []
            }
        }
        fragment++
        timestamp += hour
        while (timestamp < nextTimestamp) {
            if (out.length > 0 && timestamp == out[out.length - 1].timestamp) {
                out[out.length - 1].amount += amount
                out[out.length - 1].sender.concat(sender)
                out[out.length - 1].sumAmount = bigArray[i - 1].sumAmount
                amount = 0
                sender = []
                timestamp += hour
                continue
            }
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                if (timestamp % (4 * hour) == 0) {
                    out.push({
                        timestamp: timestamp,
                        amount: amount,
                        sender: sender,
                        sumAmount: bigArray[i - 1].sumAmount,
                    })
                    amount = 0
                    sender = []
                }
            }
            fragment++
            timestamp += hour
        }
    }
    if (
        out.length > 0 &&
        getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            4 * hour
        ) == out[out.length - 1].timestamp
    ) {
        out[out.length - 1].amount +=
            amount + bigArray[bigArray.length - 1].amount
        out[out.length - 1].sender
            .concat(sender)
            .concat(+bigArray[bigArray.length - 1].sender)
        out[out.length - 1].sumAmount = bigArray[bigArray.length - 1].sumAmount
        amount = 0
        sender = []
    } else {
        if (
            startTimestamp <=
            getWholePeriodOfTime(
                parseInt(bigArray[bigArray.length - 1].timestamp),
                4 * hour
            )
        ) {
            out.push({
                timestamp: getWholePeriodOfTime(
                    parseInt(bigArray[bigArray.length - 1].timestamp),
                    4 * hour
                ),
                amount: bigArray[bigArray.length - 1].amount,
                sender: bigArray[bigArray.length - 1].sender,
                sumAmount: bigArray[bigArray.length - 1].sumAmount,
            })
        }
    }
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        4 * hour
    )
    timestamp += 4 * hour
    while (timestamp <= endTimestamp) {
        if (timestamp < startTimestamp) {
            timestamp += 4 * hour
            continue
        }
        out.push({
            timestamp: timestamp,
            amount: 0,
            sender: [],
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += 4 * hour
    }
    return out
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

export async function getManageByMinute(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForMinutes(
            await getManageByMinutesFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForMinutes(
                bigArray[i].array,
                startTimestamp,
                endTimestamp
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

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForMinutes(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0

    if (bigArray.length == 0) {
        return out
    }
    if (bigArray.length == 1) {
        out.push({
            timestamp: bigArray[0].timestamp,
            amount: bigArray[0].amount,
            sender: bigArray[0].sender,
            sumAmount: bigArray[0].sumAmount,
        })
        return out
    }
    while (bigArray.length > j && bigArray[j].timestamp < startTimestamp) j++
    if (j != 0 && bigArray[j - 1].timestamp < startTimestamp) {
        let timestamp = getWholePeriodOfTime(startTimestamp, minute)
        timestamp += minute
        while (timestamp <= endTimestamp) {
            out.push({
                timestamp: timestamp,
                amount: 0,
                sender: [],
                sumAmount: bigArray[bigArray.length - 1].sumAmount,
            })
            timestamp += minute
        }
        return out
    }
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            minute
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            minute
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                timestamp: timestamp,
                amount: bigArray[i - 1].amount,
                sender: bigArray[i - 1].sender,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += minute
        while (timestamp < nextTimestamp) {
            if (timestamp > endTimestamp) return out
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    amount: 0,
                    sender: [],
                    sumAmount: bigArray[i - 1].sumAmount,
                })
            }
            timestamp += minute
        }
    }

    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            minute
        ),
        amount: bigArray[bigArray.length - 1].amount,
        sender: bigArray[bigArray.length - 1].sender,
        sumAmount: bigArray[bigArray.length - 1].sumAmount,
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
            sender: [],
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += minute
    }
    return out
}

export function mapManage(manage, token) {
    return manage
        .filter((i) => i.token === token)[0]
        .array.reduce(
            (acc, e) => {
                const time = parseInt(e.timestamp)
                acc.amount.push(new TVTimeValueObject(Number(e.amount), time))
                acc.sumAmount.push(
                    new TVTimeValueObject(Number(e.sumAmount), time)
                )
                return acc
            },
            {
                amount: [],
                sumAmount: [],
            }
        )
}
