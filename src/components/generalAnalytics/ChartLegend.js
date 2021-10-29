import React from 'react'
import ChartSelectSection from './ChartSelectSection'

export default function ChartLegend({ isGlobalLoading, method, changeMethod }) {
    return (
        <div className="card card-filter card-filter-scrollable">
            <div className="card-body">
                <h4 className="card-title pb-3">Legend</h4>
                <form className="flex-row mt-3">
                    <div className="form-group row">
                        <div className="col-md-12">
                            <ChartSelectSection
                                sectionName="staking"
                                {...{
                                    isGlobalLoading,
                                    method,
                                    changeMethod,
                                }}
                            />
                            <br />
                            <ChartSelectSection
                                sectionName="bonds"
                                {...{
                                    isGlobalLoading,
                                    method,
                                    changeMethod,
                                }}
                            />
                            <br />
                            <ChartSelectSection
                                sectionName="treasury"
                                {...{
                                    isGlobalLoading,
                                    method,
                                    changeMethod,
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
