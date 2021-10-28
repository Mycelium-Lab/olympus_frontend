import React, { useState } from 'react'
import LargeHolders from './LargeHolders'
import WalletAnalyticsChart from '../WalletAnalyticsChart'

import { validateNumericalInputValue } from '../../../util/inputValidation'

import { useDispatch } from 'react-redux'
import { setMessage } from '../../../redux/actions/messageActions'

import moment from 'moment'

const initValue = 10000
const startTime = 1616376464
const days = Math.floor((moment().unix() - startTime) / 86400) + 1

export default function LargeHoldersPane() {
    const [isLoading, setIsLoading] = useState(true)
    const [minAmount, setMinAmount] = useState(initValue)
    const [confirmedMinAmount, setConfirmedMinAmount] = useState(initValue)
    const dispatch = useDispatch()

    const changeMinAmount = () => {
        if (validateNumericalInputValue(minAmount)) {
            setConfirmedMinAmount(minAmount)
        } else
            dispatch(
                setMessage({
                    severity: 2,
                    text: 'Please make sure the input is filled correctly.',
                })
            )
    }
    return (
        <div className="tab-pane large-holders-pane" role="tabpanel">
            <div className="row">
                <div className="col-md-9">
                    <div className="card card-body">
                        <LargeHolders
                            setIsLoading={setIsLoading}
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

                            <form className="form-lh-update mt-3">
                                <div className="filter-input">
                                    <input
                                        type="number"
                                        onChange={(e) =>
                                            e.target.value >= 0
                                                ? setMinAmount(e.target.value)
                                                : setMinAmount(0)
                                        }
                                        value={minAmount}
                                    />
                                </div>
                                <span>OHM</span>
                            </form>
                            <button
                                disabled={isLoading}
                                onClick={() => changeMinAmount()}
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
