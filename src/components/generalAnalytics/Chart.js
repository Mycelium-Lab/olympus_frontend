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

export default function Chart({ chartRef, method, index, timeframe, ohlc }) {
    const { isGlobalLoading, isPartialLoading, sideChartHeight } = useSelector(
        (state) => state.ga
    )
    const getOhlcClass = (open, close) => {
        if (open < close) return 'positive'
        if (open > close) return 'negative'
        return 'neutral'
    }

    const validateOhlc = (ohlc) => {
        let isValid = false
        if (ohlc) {
            if (
                ohlc.hasOwnProperty('open') &&
                ohlc.hasOwnProperty('high') &&
                ohlc.hasOwnProperty('low') &&
                ohlc.hasOwnProperty('close')
            ) {
                isValid = true
            }
        }
        return isValid
    }

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
            {validateOhlc(ohlc) && (
                <div
                    className={`chart-ohlc chart-ohlc-${getOhlcClass(
                        ohlc.open,
                        ohlc.close
                    )}`}
                >
                    <div>
                        <span>O:</span>
                        <span>{parseFloat(ohlc.open).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>H:</span>
                        <span>{parseFloat(ohlc.high).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>L:</span>
                        <span>{parseFloat(ohlc.low).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>C:</span>
                        <span>{parseFloat(ohlc.close).toFixed(2)}</span>
                    </div>
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
