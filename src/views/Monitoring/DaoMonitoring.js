import React from 'react'

import '../../styles/monitoring.scss'

export default function DaoMonitoring() {
    return (
        <div className="monitoring-dao">
            <iframe
                title="Snapshot"
                src="https://snapshot.org/#/olympusdao.eth"
                frameBorder={0}
                className="dao-iframe"
            />
        </div>
    )
}
