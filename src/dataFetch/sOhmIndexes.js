import axios from 'axios'
import { TVValueTimeObject } from '../util/tvSeries'

const getSOHMIndexesInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

const getSOHMIndexesInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

const getSOHMIndexesInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapSOHMIndexes(indexes) {
    return {
        index: indexes.map((i) => new TVValueTimeObject(i.index, i.timestamp)),
    }
}

export function getSOHMIndexesInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getSOHMIndexesInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getSOHMIndexesInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getSOHMIndexesInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getSOHMIndexesInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getSOHMIndexesInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getSOHMIndexesInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getSOHMIndexesInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getSOHMIndexesInfoNMinutes(...rest, 1)
        default:
            return
    }
}
