import React, { useState } from 'react'
import FirstNWallets from './FirstNWallets'
import WalletAnalyticsChart from '../WalletAnalyticsChart'

import moment from 'moment'

const initNValue = 10
const startTime = 1616376464
const days = Math.floor((moment().unix() - startTime) / 86400) + 1

export default function FirstNWalletsPane() {
    const [nWallets, setNWallets] = useState(initNValue)
    const [confirmedNWallets, setConfirmedNWallets] = useState(initNValue)
    return (
        <div className="tab-pane" role="tabpanel">
            <div className="row">
                <div className="col-md-9">
                    <div className="card card-body">
                        <FirstNWallets
                            startTime={startTime}
                            days={days}
                            n_wallets={confirmedNWallets}
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
                            <form className="flex-row mt-3">
                                <div className="filter-name">
                                    Analyze first wallets:
                                </div>
                                <div className="filter-input">
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            setNWallets(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        value={nWallets}
                                        style={{ width: 50, marginLeft: 20 }}
                                    />
                                </div>
                            </form>
                            <button
                                onClick={() => setConfirmedNWallets(nWallets)}
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
