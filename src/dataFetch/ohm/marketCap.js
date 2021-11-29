import axios from 'axios'
import { TVTimeValueObject } from '../../util/tvSeries'

const getMarketCapInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=marketCap`,
        method: 'get',
    }).then((res) => res.data.data)

const getMarketCapInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=marketCap`,
        method: 'get',
    }).then((res) => res.data.data)

const getMarketCapInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=marketCap`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapMarketCap(marketCap) {
    return {
        marketCap: marketCap.map(
            (i) => new TVTimeValueObject(i.marketCap, i.timestamp)
        ),
    }
}

export function getMarketCapInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getMarketCapInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getMarketCapInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getMarketCapInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getMarketCapInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getMarketCapInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getMarketCapInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getMarketCapInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getMarketCapInfoNMinutes(...rest, 1)
        default:
            return
    }
}
