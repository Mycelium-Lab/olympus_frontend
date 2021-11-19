import React from 'react'
import useCharts from '../../hooks/useCharts'
import Chart from './Chart'

export default function Charts({ store }) {
    const { refs, methods, ohlcs, key } = useCharts({
        store,
        shouldBindCrossHair: true,
    })
    return (
        <div className="card card-body">
            <div key={key} className="charts-container">
                {methods.length === 0 && (
                    <div>Please select a chart from the Legend</div>
                )}
                {methods.map((method, idx) => (
                    <Chart
                        key={idx}
                        chartRef={refs[idx]}
                        index={idx}
                        ohlc={ohlcs[idx]}
                        {...{
                            store,
                            method,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
