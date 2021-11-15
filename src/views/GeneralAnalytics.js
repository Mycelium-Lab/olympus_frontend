import React from 'react'

import ChartParamsSelection from '../components/generalAnalytics/ChartParamsSelection'
import ChartLegend from '../components/generalAnalytics/ChartLegend'
import Charts from '../components/generalAnalytics/Charts'

import '../styles/generalAnalytics.scss'

export default function GeneralAnalytics() {
    return (
        <div className="main-content general-analytics-view">
            <div className="page-content">
                <div className="row pt-4">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-9">
                                        <Charts />
                                    </div>
                                    <div className="col-md-3">
                                        <ChartParamsSelection />
                                        <p></p>
                                        <ChartLegend />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
