import React, { useState } from 'react'
import LargeHolders from './LargeHolders'
import WalletAnalyticsChart from '../WalletAnalyticsChart'

import moment from 'moment'

const initValue = 10000
const startTime = 1617291702
const days = Math.floor((moment().unix() - startTime) / 86400) + 1

export default function LargeHoldersPane() {
    const [minAmount, setMinAmount] = useState(initValue)
    const [confirmedMinAmount, setConfirmedMinAmount] = useState(initValue)
    return (
        <div className="tab-pane" role="tabpanel">
            <div className="row">
                <div className="col-md-9">
                    <div className="card card-body">
                        <LargeHolders
                            startTime={startTime}
                            days={days}
                            min_amount={confirmedMinAmount}
                            render={(state) => (
                                <WalletAnalyticsChart {...state} />
                            )}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card card-filter">
                        <div className="card-body">
                            <h4 className="card-title border-bottom pb-3">
                                Filter
                            </h4>
                            <div className="filter-name mt-3">
                                Analyze wallets (staking contract not included)
                                with more than:
                            </div>

                            <form className="flex-row align-items-center mt-3">
                                <div className="filter-input">
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            setMinAmount(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        value={minAmount}
                                        style={{ width: 100 }}
                                    />
                                </div>
                                <span className="ml-2">OHM</span>
                            </form>
                            <button
                                onClick={() => setConfirmedMinAmount(minAmount)}
                                className="btn btn-success change-button save-button"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
