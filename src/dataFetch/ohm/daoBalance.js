import axios from 'axios'
import { TVValueTimeObject } from '../../util/tvSeries'

const getDaoBalanceInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalance`,
        method: 'get',
    }).then((res) => res.data.data)

const getDaoBalanceInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalance`,
        method: 'get',
    }).then((res) => res.data.data)

const getDaoBalanceInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalance`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapDaoBalance(daoBalance) {
    return {
        daoBalance: daoBalance.map(
            (i) => new TVValueTimeObject(i.daoBalance, i.timestamp)
        ),
    }
}

export function getDaoBalanceInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getDaoBalanceInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getDaoBalanceInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getDaoBalanceInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getDaoBalanceInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getDaoBalanceInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getDaoBalanceInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getDaoBalanceInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getDaoBalanceInfoNMinutes(...rest, 1)
        default:
            return
    }
}
