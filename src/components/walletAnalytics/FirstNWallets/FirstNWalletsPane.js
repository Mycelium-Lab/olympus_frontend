import React, { useState } from 'react'
import FirstNWallets from './FirstNWallets'
import WalletAnalyticsChart from '../WalletAnalyticsChart'

import { validateNumericalInputValue } from '../../../util/inputValidation'

import { useDispatch } from 'react-redux'
import { setMessage } from '../../../redux/actions/messageActions'

import moment from 'moment'

const initNValue = 10
const startTime = 1616376464
const days = Math.floor((moment().unix() - startTime) / 86400) + 1

export default function FirstNWalletsPane() {
    const [isLoading, setIsLoading] = useState(true)
    const [nWallets, setNWallets] = useState(initNValue)
    const [confirmedNWallets, setConfirmedNWallets] = useState(initNValue)

    const dispatch = useDispatch()

    const changeNWallets = () => {
        if (validateNumericalInputValue(nWallets, 1)) {
            setConfirmedNWallets(nWallets)
        } else
            dispatch(
                setMessage({
                    severity: 2,
                    text: 'Please make sure your input contains a positive number.',
                })
            )
    }
    return (
        <div className="tab-pane first-n-pane" role="tabpanel">
            <div className="row">
                <div className="col-md-9">
                    <div className="card card-body">
                        <FirstNWallets
                            setIsLoading={setIsLoading}
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
                            <form className="form-fn-update mt-3">
                                <div className="filter-name">
                                    Analyze first wallets{' '}
                                    <span>
                                        (values beyond 6000 will be hard
                                        adjusted to this number)
                                    </span>
                                    :
                                </div>
                                <div className="filter-input">
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            e.target.value < 0
                                                ? setNWallets(0)
                                                : e.target.value > 6000
                                                ? setNWallets(6000)
                                                : setNWallets(e.target.value)
                                        }
                                        value={nWallets}
                                    />
                                </div>
                            </form>
                            <button
                                disabled={isLoading}
                                onClick={() => changeNWallets()}
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
