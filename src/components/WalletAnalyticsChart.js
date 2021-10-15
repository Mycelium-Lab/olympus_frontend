import React, { createRef, useEffect, useState } from 'react'
import { createChart } from '../tv-lightweight'
import { chartConfig } from '../util/config'

export default function WalletAnalyticsChart({ data, isLoading }) {
    const [ref, setRef] = useState(null)
    useEffect(() => {
        if (data) {
            const newRef = createRef()
            setRef(newRef)
        }
    }, [data])

    useEffect(() => {
        if (ref) {
            const chart = createChart(ref.current, chartConfig)
            const line = chart.addAreaSeries({
                base: 0,
                priceFormat: {
                    type: 'volume',
                },
            })

            line.setData(data)
        }
    }, [ref])
    return <div ref={ref}></div>
}
