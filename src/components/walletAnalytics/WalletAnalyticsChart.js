import React, { createRef, useEffect, useState } from 'react'
import { createChart } from '../../tv-lightweight'
import { chartConfig } from '../../util/config'

import { Skeleton } from '@mui/material'

export default function WalletAnalyticsChart({ data, isLoading }) {
    const [ref, setRef] = useState(null)
    useEffect(() => {
        if (data) {
            const newRef = createRef()
            setRef(newRef)
        }
    }, [data])

    useEffect(() => {
        let el
        if (ref) {
            const chart = createChart(ref.current, {
                ...chartConfig,
                width: ref.current.innerWidth,
                height: ref.current.innerHeight,
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        color: 'rgba(231,232,232,0.3)',
                    },
                    timeScale: {
                        rightOffset: 15,
                        minBarSpacing: 3,
                    },
                },
            })
            const line = chart.addAreaSeries({
                base: 0,
                priceFormat: {
                    type: 'volume',
                },
            })

            line.setData(data)

            const ro = new ResizeObserver((entries) => {
                const cr = entries[0].contentRect
                chart.resize(cr.width, cr.height)
            })

            ro.observe(ref.current)

            el = document.addEventListener('resize', () => {
                chart.resize(ref.current.innerWidth, ref.current.innerHeight)
            })
        }
        return () => document.removeEventListener('resize', el)
    }, [ref])
    return isLoading ? (
        <Skeleton variant="rect" animation="wave" width="100%" height={400} />
    ) : (
        <div className="wa-chart-wrapper">
            <div className="wa-chart" ref={ref}></div>
        </div>
    )
}
