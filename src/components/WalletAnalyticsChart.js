import React, { createRef, useEffect } from 'react'
import { createChart } from '../tv-lightweight'

import { chartConfig } from '../util/config'

import axios from 'axios'

export default function WalletAnalyticsChart() {
    const ref = createRef()
    useEffect(async () => {
        const result = await axios.get(
            'http://62.84.119.83:8000/api/get_top_days/?start=1617291702&days=250'
        )

        const realData = result.data.data.map((e) => ({
            time: e.timestamp,
            value: e.balance,
        }))

        const chart = createChart(ref.current, chartConfig)
        const line = chart.addAreaSeries({
            base: 0,
            priceFormat: {
                type: 'volume',
            },
        })

        line.setData(realData)
    }, [])
    return <div ref={ref}></div>
}
