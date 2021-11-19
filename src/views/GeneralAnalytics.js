import React from 'react'

import ChartParamsSelection from '../components/charts/ChartParamsSelection'
import ChartLegend from '../components/charts/ChartLegend'
import Charts from '../components/charts/Charts'

import '../styles/generalAnalytics.scss'

export default function GeneralAnalytics() {
    const store = 'ga'
    return (
        <div className="main-content general-analytics-view">
            <div className="page-content">
                <div className="row pt-4">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-9">
                                        <Charts store={store} />
                                    </div>
                                    <div className="col-md-3">
                                        <ChartParamsSelection store={store} />
                                        <p></p>
                                        <ChartLegend store={store} />
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
