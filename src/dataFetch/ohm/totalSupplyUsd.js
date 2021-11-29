import axios from 'axios'
import { TVTimeValueObject } from '../../util/tvSeries'

const getTotalSupplyUsdInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupplyUsd`,
        method: 'get',
    }).then((res) => res.data.data)

const getTotalSupplyUsdInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupplyUsd`,
        method: 'get',
    }).then((res) => res.data.data)

const getTotalSupplyUsdInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupplyUsd`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapTotalSupplyUsd(totalSupplyUsd) {
    return {
        totalSupplyUsd: totalSupplyUsd.map(
            (i) => new TVTimeValueObject(i.totalSupplyUsd, i.timestamp)
        ),
    }
}

export function getTotalSupplyUsdInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getTotalSupplyUsdInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getTotalSupplyUsdInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getTotalSupplyUsdInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getTotalSupplyUsdInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getTotalSupplyUsdInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getTotalSupplyUsdInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getTotalSupplyUsdInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getTotalSupplyUsdInfoNMinutes(...rest, 1)
        default:
            return
    }
}
