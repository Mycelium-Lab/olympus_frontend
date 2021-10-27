import React from 'react'

import '../../styles/monitoring.scss'

export default function DaoMonitoring() {
    return (
        <div className="monitoring-dao">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h4 className="page-title mb-0 font-size-18">
                                &nbsp;
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-10 ml-auto mr-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="DAO-mon">
                                        <iframe
                                            title="Snapshot"
                                            src="https://snapshot.org/#/olympusdao.eth"
                                            frameBorder={0}
                                            className="iframe-100"
                                        />
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
