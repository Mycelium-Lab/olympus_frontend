import axios from 'axios'
import { token } from './config.js'
import { getWholePeriodOfTime } from './utils/date.js'
import { getTokens } from './getTokens.js'

const day = 60 * 60 * 24

// graphql request for the Graph
const dayQuery = `
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
           timestamp
           profit
           amount
           value
           sender
           sumValue
           sumProfit
           sumAmount
           id
     }
   }
 }
  `

export async function getDepositByDay(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForDays(
            await getDepositByDaysFromGraph()
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

async function getDepositByDaysFromGraph() {
    try {
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: dayQuery,
            },
        })
        return dayData.data.data.depositFunctionYearEntities
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
        for (let j = 0; j < days[i].dayDeposit.length; j++) {
            for (let m = 0; m < tokens.length; m++) {
                if (days[i].dayDeposit[j].id.slice(0, 42) == tokens[m]) {
                    out[m].array.push(days[i].dayDeposit[j])
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
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    let out = []
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
                profit: bigArray[i - 1].profit,
                amount: bigArray[i - 1].amount,
                value: bigArray[i - 1].value,
                sender: bigArray[i - 1].sender,
                sumValue: bigArray[i - 1].sumValue,
                sumProfit: bigArray[i - 1].sumProfit,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += day
        if (timestamp > endTimestamp) return out

        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    profit: 0,
                    amount: 0,
                    value: 0,
                    sender: [],
                    sumValue: bigArray[i - 1].sumValue,
                    sumProfit: bigArray[i - 1].sumProfit,
                    sumAmount: bigArray[i - 1].sumAmount,
                })
            }
            timestamp += day
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            day
        ),
        profit: bigArray[bigArray.length - 1].profit,
        amount: bigArray[bigArray.length - 1].amount,
        value: bigArray[bigArray.length - 1].value,
        sender: bigArray[bigArray.length - 1].sender,
        sumValue: bigArray[bigArray.length - 1].sumValue,
        sumProfit: bigArray[bigArray.length - 1].sumProfit,
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
            profit: 0,
            amount: 0,
            value: 0,
            sender: [],
            sumValue: bigArray[bigArray.length - 1].sumValue,
            sumProfit: bigArray[bigArray.length - 1].sumProfit,
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += day
    }
    return out
}

const hour = 60 * 60

// graphql request for the Graph
const hourQuery = `
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
       hourDeposit(first:24  orderBy:timestamp){
           timestamp
           profit
           amount
           value
           sender
           sumValue
           sumProfit
           sumAmount
           id
       }
     }
     
   }
 }
  `

export async function getDepositByHour(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getDepositByHoursFromGraph()
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

export async function getDepositBy4Hour(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getDepositByHoursFromGraph()
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

async function getDepositByHoursFromGraph() {
    try {
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: hourQuery,
            },
        })
        return hourData.data.data.depositFunctionYearEntities
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
        for (let j = 0; j < days[i].dayDeposit.length; j++) {
            for (let k = 0; k < days[i].dayDeposit[j].hourDeposit.length; k++) {
                for (let m = 0; m < tokens.length; m++) {
                    if (
                        days[i].dayDeposit[j].hourDeposit[k].id.slice(0, 42) ==
                        tokens[m]
                    ) {
                        out[m].array.push(days[i].dayDeposit[j].hourDeposit[k])
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
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        if (timestamp >= startTimestamp) {
            out.push({
                timestamp: timestamp,
                profit: bigArray[i - 1].profit,
                amount: bigArray[i - 1].amount,
                value: bigArray[i - 1].value,
                sender: bigArray[i - 1].sender,
                sumValue: bigArray[i - 1].sumValue,
                sumProfit: bigArray[i - 1].sumProfit,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += hour
        while (timestamp < nextTimestamp) {
            out.push({
                timestamp: timestamp,
                profit: 0,
                amount: 0,
                value: 0,
                sender: [],
                sumValue: bigArray[i - 1].sumValue,
                sumProfit: bigArray[i - 1].sumProfit,
                sumAmount: bigArray[i - 1].sumAmount,
            })
            timestamp += hour
        }
    }

    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            hour
        ),
        profit: bigArray[bigArray.length - 1].profit,
        amount: bigArray[bigArray.length - 1].amount,
        value: bigArray[bigArray.length - 1].value,
        sender: bigArray[bigArray.length - 1].sender,
        sumValue: bigArray[bigArray.length - 1].sumValue,
        sumProfit: bigArray[bigArray.length - 1].sumProfit,
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
            profit: 0,
            amount: 0,
            value: 0,
            sender: [],
            sumValue: bigArray[bigArray.length - 1].sumValue,
            sumProfit: bigArray[bigArray.length - 1].sumProfit,
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += 4 * hour
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
    let profit = 0
    let amount = 0
    let value = 0
    let sender = []
    let out = []
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            hour
        )
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            hour
        )
        profit += bigArray[i - 1].profit
        if (timestamp > endTimestamp) return out
        amount += bigArray[i - 1].amount
        value += bigArray[i - 1].value
        sender = sender.concat(bigArray[i - 1].sender)
        if (timestamp >= startTimestamp) {
            if (fragment % 4 == 3) {
                out.push({
                    timestamp: timestamp,
                    profit: bigArray[i - 1].profit,
                    amount: bigArray[i - 1].amount,
                    value: bigArray[i - 1].value,
                    sender: bigArray[i - 1].sender,
                    sumValue: bigArray[i - 1].sumValue,
                    sumProfit: bigArray[i - 1].sumProfit,
                    sumAmount: bigArray[i - 1].sumAmount,
                })
                profit = 0
                amount = 0
                value = 0
                sender = []
            }
        }
        fragment++
        timestamp += hour
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                if (fragment % 4 == 3) {
                    out.push({
                        timestamp: timestamp,
                        profit: profit,
                        amount: amount,
                        value: value,
                        sender: sender,
                        sumValue: bigArray[i - 1].sumValue,
                        sumProfit: bigArray[i - 1].sumProfit,
                        sumAmount: bigArray[i - 1].sumAmount,
                    })
                    profit = 0
                    amount = 0
                    value = 0
                    sender = []
                }
            }
            fragment++
            timestamp += hour
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            4 * hour
        ),
        profit: bigArray[bigArray.length - 1].profit,
        amount: bigArray[bigArray.length - 1].amount,
        value: bigArray[bigArray.length - 1].value,
        sender: bigArray[bigArray.length - 1].sender,
        sumValue: bigArray[bigArray.length - 1].sumValue,
        sumProfit: bigArray[bigArray.length - 1].sumProfit,
        sumAmount: bigArray[bigArray.length - 1].sumAmount,
    })
    let timestamp = getWholePeriodOfTime(
        parseInt(bigArray[bigArray.length - 1].timestamp),
        4 * hour
    )
    timestamp += 4 * hour
    while (timestamp <= endTimestamp) {
        out.push({
            timestamp: timestamp,
            profit: 0,
            amount: 0,
            value: 0,
            sender: [],
            sumValue: bigArray[bigArray.length - 1].sumValue,
            sumProfit: bigArray[bigArray.length - 1].sumProfit,
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += 4 * hour
    }
    return out
}

const minute = 60

// graphql request for the Graph
const minuteQuery = `
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
       hourDeposit(first:24  orderBy:timestamp){
           minuteDeposit(first:60  orderBy:timestamp){
           timestamp
           profit
           amount
           value
           sender
           sumValue
           sumProfit
           sumAmount
           id
         }
       }
     }
     
   }
 }
  `

export async function getDepositByMinute(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        let bigArray = await reformToBigArrayForMinutes(
            await getDepositByMinutesFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForMinues(
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

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
async function getDepositByMinutesFromGraph() {
    try {
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: minuteQuery,
            },
        })
        return minuteData.data.data.depositFunctionYearEntities
    } catch (err) {
        console.log(err)
    }
}

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
        for (let j = 0; j < days[i].dayDeposit.length; j++) {
            for (let k = 0; k < days[i].dayDeposit[j].hourDeposit.length; k++) {
                for (
                    let l = 0;
                    l <
                    days[i].dayDeposit[j].hourDeposit[k].minuteDeposit.length;
                    l++
                ) {
                    for (let m = 0; m < tokens.length; m++) {
                        if (
                            days[i].dayDeposit[j].hourDeposit[k].minuteDeposit[
                                l
                            ].id.slice(0, 42) == tokens[m]
                        ) {
                            out[m].array.push(
                                days[i].dayDeposit[j].hourDeposit[k]
                                    .minuteDeposit[l]
                            )
                        }
                    }
                }
            }
        }
    }
    return out
}
function fillBigArrayForMinues(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0
    while (bigArray[j].timestamp < startTimestamp) j++
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
                profit: bigArray[i - 1].profit,
                amount: bigArray[i - 1].amount,
                value: bigArray[i - 1].value,
                sender: bigArray[i - 1].sender,
                sumValue: bigArray[i - 1].sumValue,
                sumProfit: bigArray[i - 1].sumProfit,
                sumAmount: bigArray[i - 1].sumAmount,
            })
        }
        timestamp += minute
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    timestamp: timestamp,
                    profit: 0,
                    amount: 0,
                    value: 0,
                    sender: [],
                    sumValue: bigArray[i - 1].sumValue,
                    sumProfit: bigArray[i - 1].sumProfit,
                    sumAmount: bigArray[i - 1].sumAmount,
                })
            }
            timestamp += minute
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            minute
        ),
        profit: bigArray[bigArray.length - 1].profit,
        amount: bigArray[bigArray.length - 1].amount,
        value: bigArray[bigArray.length - 1].value,
        sender: bigArray[bigArray.length - 1].sender,
        sumValue: bigArray[bigArray.length - 1].sumValue,
        sumProfit: bigArray[bigArray.length - 1].sumProfit,
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
            profit: 0,
            amount: 0,
            value: 0,
            sender: [],
            sumValue: bigArray[bigArray.length - 1].sumValue,
            sumProfit: bigArray[bigArray.length - 1].sumProfit,
            sumAmount: bigArray[bigArray.length - 1].sumAmount,
        })
        timestamp += minute
    }
    return out
}

class TVTimeValueObject {
    constructor(value, time) {
        this.time = time
        this.value = value
    }
}

export function mapDeposit(deposit, token) {
    return deposit
        .filter((i) => i.token === token)[0]
        .array.reduce(
            (acc, e) => {
                const time = parseInt(e.timestamp)
                acc.profit.push(new TVTimeValueObject(Number(e.profit), time))
                acc.amount.push(new TVTimeValueObject(Number(e.amount), time))
                acc.value.push(new TVTimeValueObject(Number(e.value), time))
                acc.sumProfit.push(
                    new TVTimeValueObject(Number(e.sumProfit), time)
                )
                acc.sumAmount.push(
                    new TVTimeValueObject(Number(e.sumAmount), time)
                )
                acc.sumValue.push(
                    new TVTimeValueObject(Number(e.sumValue), time)
                )
                return acc
            },
            {
                profit: [],
                amount: [],
                value: [],
                sumProfit: [],
                sumAmount: [],
                sumValue: [],
            }
        )
}