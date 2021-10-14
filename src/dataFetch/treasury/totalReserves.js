import axios from 'axios'
import { token } from './config.js'
import { getWholePeriodOfTime } from './utils/date.js'

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

export async function getTotalReservesByDay(
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
                totalReverse: bigArray[i - 1].finalTotalReserves,
                timestamp: timestamp,
                audited: bigArray[i - 1].audited,
            })
        }
        timestamp += day
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    totalReverse: bigArray[i - 1].finalTotalReserves,
                    timestamp: timestamp,
                    audited: false,
                })
            }

            timestamp += day
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        totalReverse: bigArray[bigArray.length - 1].finalTotalReserves,
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            day
        ), ////?
        audited: bigArray[bigArray.length - 1].audited,
    })
    return out
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

export async function getTotalReservesByHour(
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
export async function getTotalReserveBy4Hour(
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
                totalReverse: bigArray[i - 1].finalTotalReserves,
                timestamp: timestamp,
                audited: bigArray[i - 1].audited,
            })
        }
        timestamp += hour
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    totalReverse: bigArray[i - 1].finalTotalReserves,
                    timestamp: timestamp,
                    audited: false,
                })
            }
            timestamp += hour
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        totalReverse: bigArray[bigArray.length - 1].finalTotalReserves,
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            hour
        ),
        audited: bigArray[bigArray.length - 1].audited,
    })
    return out
}
/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayFor4Hours(bigArray, startTimestamp, endTimestamp) {
    let out = []
    let j = 0

    while (bigArray[j].timestamp < startTimestamp) j++
    for (let i = j == 0 ? 1 : j; i < bigArray.length; i++) {
        let nextTimestamp = getWholePeriodOfTime(
            parseInt(bigArray[i].timestamp),
            4 * hour
        )
        let timestamp = getWholePeriodOfTime(
            parseInt(bigArray[i - 1].timestamp),
            4 * hour
        )
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                totalReverse: bigArray[i - 1].finalTotalReserves,
                timestamp: timestamp,
                audited: bigArray[i - 1].audited,
            })
        }
        timestamp += 4 * hour
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    totalReverse: bigArray[i - 1].finalTotalReserves,
                    timestamp: timestamp,
                    audited: false,
                })
            }
            timestamp += 4 * hour
            if (timestamp > endTimestamp) return out
        }
    }

    out.push({
        totalReverse: bigArray[bigArray.length - 1].finalTotalReserves,
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            4 * hour
        ),
        audited: bigArray[bigArray.length - 1].audited,
    })
    return out
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

export async function getTotalReserveByMinute(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000
) {
    try {
        return fillBigArrayForMinues(
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

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray
 * @returns
 */
function fillBigArrayForMinues(bigArray, startTimestamp, endTimestamp) {
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
        if (timestamp > endTimestamp) return out
        if (timestamp >= startTimestamp) {
            out.push({
                totalReverse: bigArray[i - 1].finalTotalReserves,
                timestamp: timestamp,
                audited: bigArray[i - 1].audited,
            })
        }
        timestamp += minute
        if (timestamp > endTimestamp) return out
        while (timestamp < nextTimestamp) {
            if (timestamp >= startTimestamp) {
                out.push({
                    totalReverse: bigArray[i - 1].finalTotalReserves,
                    timestamp: timestamp,
                    audited: false,
                })
            }
            timestamp += minute
            if (timestamp > endTimestamp) return out
        }
    }
    out.push({
        totalReverse: bigArray[bigArray.length - 1].finalTotalReserves,
        timestamp: getWholePeriodOfTime(
            parseInt(bigArray[bigArray.length - 1].timestamp),
            minute
        ),
        audited: bigArray[bigArray.length - 1].audited,
    })
    return out
}

export function mapTotalReserves(total_reserves) {
    return total_reserves.map((e) => ({
        time: parseInt(e.timestamp),
        value: Number(e.totalReverse),
    }))
}
