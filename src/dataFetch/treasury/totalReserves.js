import axios from 'axios'
import { token } from './config.js'
import { TVTimeValueObject } from '../../util/tvSeries.js'

const day = 60 * 60 * 24
const dayQuery = `
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
        audited
        timestamp
        finalTotalReserves
    }
  }
}
`

export async function getTotalReservesByNDays(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNDays(
            reformToBigArrayForDays(await getTotalReserveByDaysFromGraph()),
            startTimestamp,
            endTimestamp,
            n
        )
    } catch (err) {
        console.log(err)
    }
}

async function getTotalReserveByDaysFromGraph() {
    try {
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`, //QmRpuXnecL1xjHgUUMSBaeok9Ggkpdep9KJNMLJxSbDvxZ
            method: 'post',
            data: {
                query: dayQuery,
            },
        })
        return dayData.data.data.reservesYearsEntities
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
        for (let j = 0; j < days[i].reserversDays.length; j++) {
            out.push(days[i].reserversDays[j])
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
            totalReserves:
                data.length > 0 ? data[data.length - 1].totalReserves : 0,
            audited: false,
        }
        console.log(stakes[0])
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.totalReserves = Number(stakes[j].finalTotalReserves)
                obj.audited = stakes[j].audited
            }
        }
        data.push(obj)
    }
    return data
}

const hour = 60 * 60
const hourQuery = `
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
      reserversHours(first: 24 orderBy:timestamp) {
        audited
        timestamp
        finalTotalReserves
      }
    }
  }
}
`

export async function getTotalReservesByNHours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNHours(
            reformToBigArrayForHours(await getTotalReserveByHoursFromGraph()),
            startTimestamp,
            endTimestamp,
            n
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
        return hourData.data.data.reservesYearsEntities
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
        for (let j = 0; j < days[i].reserversDays.length; j++) {
            for (
                let k = 0;
                k < days[i].reserversDays[j].reserversHours.length;
                k++
            ) {
                out.push(days[i].reserversDays[j].reserversHours[k])
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
            totalReserves:
                data.length > 0 ? data[data.length - 1].totalReserves : 0,
            audited: false,
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.totalReserves = Number(stakes[j].finalTotalReserves)
                obj.audited = stakes[j].audited
            }
        }
        data.push(obj)
    }
    return data
}

const minute = 60

const minuteQuery = `
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
      reserversHours(first: 24 orderBy:timestamp) {
        reserversMinutes(first: 60 orderBy:timestamp) {
          audited
          timestamp
          finalTotalReserves
        }
      }
    }
  }
}
  `

export async function getTotalReservesByNMinutes(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        return fillBigArrayForNMinutes(
            reformToBigArrayForMinutes(
                await getTotalReserveByMinutesFromGraph()
            ),
            startTimestamp,
            endTimestamp,
            n
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
        return minuteData.data.data.reservesYearsEntities
    } catch (err) {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
function reformToBigArrayForMinutes(days) {
    let out = []
    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].reserversDays.length; j++) {
            for (
                let k = 0;
                k < days[i].reserversDays[j].reserversHours.length;
                k++
            ) {
                for (
                    let l = 0;
                    l <
                    days[i].reserversDays[j].reserversHours[k].reserversMinutes
                        .length;
                    l++
                ) {
                    out.push(
                        days[i].reserversDays[j].reserversHours[k]
                            .reserversMinutes[l]
                    )
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
            totalReserves:
                data.length > 0 ? data[data.length - 1].totalReserves : 0,
            audited: false,
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.totalReserves = Number(stakes[j].finalTotalReserves)
                obj.audited = stakes[j].audited
            }
        }
        data.push(obj)
    }
    return data
}

export const totalReservesFuncs = [
    (...args) => getTotalReservesByNDays(...args, 7),
    (...args) => getTotalReservesByNDays(...args, 1),
    (...args) => getTotalReservesByNHours(...args, 8),
    (...args) => getTotalReservesByNHours(...args, 4),
    (...args) => getTotalReservesByNHours(...args, 1),
    (...args) => getTotalReservesByNMinutes(...args, 15),
    (...args) => getTotalReservesByNMinutes(...args, 5),
    (...args) => getTotalReservesByNMinutes(...args, 1),
]

export function mapTotalReserves(total_reserves) {
    return total_reserves.reduce(
        (acc, e) => {
            const time = parseInt(e.timestamp)
            acc.total_reserves.push(
                new TVTimeValueObject(Number(e.totalReserves), time)
            )
            return acc
        },
        {
            total_reserves: [],
        }
    )
}
