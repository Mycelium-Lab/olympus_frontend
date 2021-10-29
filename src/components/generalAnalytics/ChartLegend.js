import React, { Fragment } from 'react'
import ChartSelectSection from './ChartSelectSection'

import { methodPropsChartConfigs } from '../../util/config'

export default function ChartLegend({ isGlobalLoading, method, changeMethod }) {
    return (
        <div className="card card-filter card-filter-scrollable">
            <div className="card-body">
                <h4 className="card-title pb-3">Legend</h4>
                <form className="flex-row mt-3">
                    <div className="form-group row">
                        {/* we are slicing 'dexes' index, as it is the main
                            chart so far */}
                        <div className="col-md-12">
                            {Object.keys(methodPropsChartConfigs)
                                .slice(1)
                                .map((key, idx) => (
                                    <Fragment key={key}>
                                        {idx !== 0 && <br />}
                                        <ChartSelectSection
                                            sectionName={key}
                                            {...{
                                                isGlobalLoading,
                                                method,
                                                changeMethod,
                                            }}
                                        />
                                    </Fragment>
                                ))}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
