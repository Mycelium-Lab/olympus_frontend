import axios from 'axios'
import { TVValueTimeObject } from '../../util/tvSeries'

const getCirculatingSupplyInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=circulatingSupply`,
        method: 'get',
    }).then((res) => res.data.data)

const getCirculatingSupplyInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=circulatingSupply`,
        method: 'get',
    }).then((res) => res.data.data)

const getCirculatingSupplyInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=circulatingSupply`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapCirculatingSupply(circulatingSupply) {
    return {
        circulatingSupply: circulatingSupply.map(
            (i) => new TVValueTimeObject(i.circulatingSupply, i.timestamp)
        ),
    }
}

export function getCirculatingSupplyInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getCirculatingSupplyInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getCirculatingSupplyInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getCirculatingSupplyInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getCirculatingSupplyInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getCirculatingSupplyInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getCirculatingSupplyInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getCirculatingSupplyInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getCirculatingSupplyInfoNMinutes(...rest, 1)
        default:
            return
    }
}
