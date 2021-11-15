import React from 'react'
import parse from 'html-react-parser'

import { useSelector } from 'react-redux'

import { ReactComponent as LoadingSpinner } from '../../images/vectors/spinner.svg'
import { Skeleton } from '@mui/material'

import {
    methodPropsChartConfigs,
    timeframesConfig,
    chartConfig,
} from '../../util/config'

export default function Chart({ chartRef, method, index, timeframe }) {
    const { isGlobalLoading, isPartialLoading, sideChartHeight } = useSelector(
        (state) => state.ga
    )
    return (
        <div className="chart-outer">
            {isGlobalLoading && (
                <Skeleton
                    style={{
                        width: 'inherit',
                        position: 'absolute',
                        zIndex: 5,
                        borderRadius: 4,
                    }}
                    variant="rect"
                    animation="wave"
                    width="100%"
                    height={
                        (index === 0 ? chartConfig.height : sideChartHeight) -
                        10 // 10 is the skeleton padding
                    }
                />
            )}
            <span className="chart-title">
                {parse(
                    methodPropsChartConfigs[method.type][method.orderNumber]
                        .title
                )}
                ,{` ${timeframesConfig[timeframe].name}`}
            </span>
            {isPartialLoading && (
                <div className="loading-spinner">
                    <LoadingSpinner />
                </div>
            )}
            <div
                style={isGlobalLoading ? { zIndex: -1 } : {}}
                className="chart-inner"
                ref={chartRef}
            ></div>
        </div>
    )
}
