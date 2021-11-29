import axios from 'axios'
import { TVTimeValueObject } from '../../util/tvSeries'

const getTotalSupplyInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupply`,
        method: 'get',
    }).then((res) => res.data.data)

const getTotalSupplyInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupply`,
        method: 'get',
    }).then((res) => res.data.data)

const getTotalSupplyInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=totalSupply`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapTotalSupply(totalSupply) {
    return {
        totalSupply: totalSupply.map(
            (i) => new TVTimeValueObject(i.totalSupply, i.timestamp)
        ),
    }
}

export function getTotalSupplyInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getTotalSupplyInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getTotalSupplyInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getTotalSupplyInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getTotalSupplyInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getTotalSupplyInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getTotalSupplyInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getTotalSupplyInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getTotalSupplyInfoNMinutes(...rest, 1)
        default:
            return
    }
}
