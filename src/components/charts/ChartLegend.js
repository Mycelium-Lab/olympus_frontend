import React, { Fragment } from 'react'
import ChartSelectSection from './ChartSelectSection'

import { methodPropsChartConfigs } from '../../util/config'
import { useSelector } from 'react-redux'

export default function ChartLegend({ store }) {
    const { isGlobalLoading, methods } = useSelector((state) => state[store])
    return (
        <div className="card card-filter card-filter-scrollable">
            <div className="card-body">
                <h4 className="card-title pb-3">Legend</h4>
                <form className="flex-row mt-3">
                    <div className="form-group row">
                        <div className="col-md-12">
                            {Object.keys(methodPropsChartConfigs).map(
                                (key, idx) => (
                                    <Fragment key={key}>
                                        {idx !== 0 && <br />}
                                        <ChartSelectSection
                                            sectionName={key}
                                            {...{
                                                isGlobalLoading,
                                                methods,
                                                store,
                                            }}
                                        />
                                    </Fragment>
                                )
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
