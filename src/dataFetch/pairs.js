import axios from 'axios'
import moment from 'moment'

export async function getPairsInfoDays(startTimestamp, days) {
    let query = `
    {	
        pairYears(first: 1 where:{id:"OHM-DAI2021pair"}){
          dayPair(first:365, orderBy:timestamp)
          {
                token1Price
                token1PriceLow
                token1PriceOpen
                token1PriceHigh
                timestamp
                volumeToken0In
                volumeToken0Out
                volumeToken1In
                volumeToken1Out
            }
        }
      }
    
    `
    try {
        const pairData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: query,
            },
        })
        const pair = pairData.data.data.pairYears
        let data = []
        let pairs = []
        for (let i = 0; i < pair[0].dayPair.length; ++i) {
            let obj = {}
            obj.token1PriceClose = pair[0].dayPair[i].token1Price
            obj.token1PriceLow = pair[0].dayPair[i].token1PriceLow
            obj.token1PriceOpen = pair[0].dayPair[i].token1PriceOpen
            obj.token1PriceHigh = pair[0].dayPair[i].token1PriceHigh
            obj.timestamp = pair[0].dayPair[i].timestamp
            obj.volumeToken1In = pair[0].dayPair[i].volumeToken1In
            obj.volumeToken1Out = pair[0].dayPair[i].volumeToken1Out
            pairs.push(obj)
        }
        for (let i = 0; i < days - 1; ++i) {
            let beginTimestamp = startTimestamp + i * 86400
            let endTimestamp = startTimestamp + (i + 1) * 86400

            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                token1PriceOpen: 0,
                token1PriceClose: 0,
                token1PriceHigh: 0,
                token1PriceLow: 0,
                volumeToken1In: 0,
                volumeToken1Out: 0,
            }
            for (let j = 0; j < pairs.length; ++j) {
                if (
                    beginTimestamp <= pairs[j].timestamp &&
                    pairs[j].timestamp < endTimestamp
                ) {
                    obj.token1PriceOpen = pairs[j].token1PriceOpen
                    obj.token1PriceClose = pairs[j].token1PriceClose
                    obj.token1PriceHigh = pairs[j].token1PriceHigh
                    obj.token1PriceLow = pairs[j].token1PriceLow
                    obj.volumeToken1In = pairs[j].volumeToken1In
                    obj.volumeToken1Out = pairs[j].volumeToken1Out
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function mapPairs(pairs) {
    return pairs.reduce(
        (acc, e) => {
            const time = moment
                .unix(parseInt(e.beginTimestamp))
                .format('YYYY-MM-DD')
            acc.priceCandles.push({
                open: Number(e.token1PriceOpen),
                close: Number(e.token1PriceClose),
                high: Number(e.token1PriceHigh),
                low: Number(e.token1PriceLow),
                time,
            })
            acc.volumeUp.push({
                value: Math.round(
                    Number(e.volumeToken1In) + Number(e.volumeToken1Out)
                ),
                time,
            })
            acc.volumeDown.push({
                value: Math.round(Number(e.volumeToken1Out)),
                time,
            })
            return acc
        },
        { priceCandles: [], volumeUp: [], volumeDown: [] }
    )
}
