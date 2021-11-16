import axios from 'axios'
import { TVTimeValueObject } from '../util/tvSeries'

const getIndexesInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

const getIndexesInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

const getIndexesInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_index_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapIndexes(indexes) {
    return {
        index: indexes.map((i) => new TVTimeValueObject(i.index, i.timestamp)),
    }
}

export function getIndexesInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getIndexesInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getIndexesInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getIndexesInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getIndexesInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getIndexesInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getIndexesInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getIndexesInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getIndexesInfoNMinutes(...rest, 1)
        default:
            return
    }
}
