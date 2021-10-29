import React from 'react'
import TooltippedComponent from '../util/TooltippedComponent'

import timezones from '../../util/timezones'
import { timeframesConfig } from '../../util/config'

export default function ChartParamsSelection({
    timeframe,
    changeTimeframe,
    timezone,
    changeTimezone,
    isGlobalLoading,
}) {
    return (
        <div className="card card-filter">
            <div className="card-body">
                <h4 className="card-title pb-3">Chart Settings</h4>
                <form className="flex-row mt-3">
                    <div className="tv-selector-container">
                        <TooltippedComponent info={'Timeframe'}>
                            <div>
                                <select
                                    defaultValue={timeframe}
                                    disabled={isGlobalLoading}
                                    onChange={(e) => {
                                        changeTimeframe(
                                            parseInt(e.target.value)
                                        )
                                    }}
                                    className="form-control"
                                >
                                    {timeframesConfig.map((t, idx) => (
                                        <option key={idx} value={idx}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </TooltippedComponent>
                        <TooltippedComponent info={'Timezone'}>
                            <div>
                                <select
                                    className="form-control"
                                    defaultValue={timezone}
                                    disabled={isGlobalLoading}
                                    onChange={(e) => {
                                        changeTimezone(parseInt(e.target.value))
                                    }}
                                >
                                    {timezones.map((t, idx) => (
                                        <option key={idx} value={idx}>
                                            {idx !== timezone
                                                ? t.text
                                                : t.text.split(' ')[0]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </TooltippedComponent>
                    </div>
                </form>
            </div>
        </div>
    )
}
