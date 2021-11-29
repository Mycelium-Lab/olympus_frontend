import axios from 'axios'
import { token } from './config.js'
import { getTokens } from './getTokens.js'
import { TVTimeValueObject } from '../../util/tvSeries.js'

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

export async function getDepositByNDays(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForDays(
            await getDepositByDaysFromGraph()
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
            profit: 0,
            value: 0,
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sumProfit: data.length == 0 ? 0 : data[data.length - 1].sumProfit,
            sumValue: data.length == 0 ? 0 : data[data.length - 1].sumValue,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.profit += Number(stakes[j].profit)
                obj.value += Number(stakes[j].value)
                obj.sumValue = Number(stakes[j].sumValue)
                obj.sumProfit = Number(stakes[j].sumProfit)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
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

export async function getDepositByNHours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getDepositByHoursFromGraph()
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
            profit: 0,
            value: 0,
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sumProfit: data.length == 0 ? 0 : data[data.length - 1].sumProfit,
            sumValue: data.length == 0 ? 0 : data[data.length - 1].sumValue,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.profit += Number(stakes[j].profit)
                obj.value += Number(stakes[j].value)
                obj.sumValue = Number(stakes[j].sumValue)
                obj.sumProfit = Number(stakes[j].sumProfit)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
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

export async function getDepositByNMinutes(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForMinutes(
            await getDepositByMinutesFromGraph()
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
            profit: 0,
            value: 0,
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sumProfit: data.length == 0 ? 0 : data[data.length - 1].sumProfit,
            sumValue: data.length == 0 ? 0 : data[data.length - 1].sumValue,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.profit += Number(stakes[j].profit)
                obj.value += Number(stakes[j].value)
                obj.sumValue = Number(stakes[j].sumValue)
                obj.sumProfit = Number(stakes[j].sumProfit)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
}

export function getDepositInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getDepositByNDays(...rest, 7)
        case 1:
            return (...rest) => getDepositByNDays(...rest, 1)
        case 2:
            return (...rest) => getDepositByNHours(...rest, 8)
        case 3:
            return (...rest) => getDepositByNHours(...rest, 4)
        case 4:
            return (...rest) => getDepositByNHours(...rest, 1)
        case 5:
            return (...rest) => getDepositByNMinutes(...rest, 15)
        case 6:
            return (...rest) => getDepositByNMinutes(...rest, 5)
        case 7:
            return (...rest) => getDepositByNMinutes(...rest, 1)
        default:
            return
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
