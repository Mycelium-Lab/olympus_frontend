import axios from 'axios'
import { TVTimeValueObject } from '../../util/tvSeries'

const getDaoBalanceUsdInfoNDays = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_days?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalanceUsd`,
        method: 'get',
    }).then((res) => res.data.data)

const getDaoBalanceUsdInfoNHours = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_hours?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalanceUsd`,
        method: 'get',
    }).then((res) => res.data.data)

const getDaoBalanceUsdInfoNMinutes = (startTimestamp, endTimestamp, n) =>
    axios({
        url: `${process.env.REACT_APP_API_URL}/api/get_ga_n_minutes?start=${startTimestamp}&end=${endTimestamp}&n=${n}&types=daoBalanceUsd`,
        method: 'get',
    }).then((res) => res.data.data)

export function mapDaoBalanceUsd(daoBalanceUsd) {
    return {
        daoBalanceUsd: daoBalanceUsd.map(
            (i) => new TVTimeValueObject(i.daoBalanceUsd, i.timestamp)
        ),
    }
}

export function getDaoBalanceUsdInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getDaoBalanceUsdInfoNDays(...rest, 7)
        case 1:
            return (...rest) => getDaoBalanceUsdInfoNDays(...rest, 1)
        case 2:
            return (...rest) => getDaoBalanceUsdInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getDaoBalanceUsdInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getDaoBalanceUsdInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getDaoBalanceUsdInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getDaoBalanceUsdInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getDaoBalanceUsdInfoNMinutes(...rest, 1)
        default:
            return
    }
}
