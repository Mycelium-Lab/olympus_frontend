import React, { useEffect, useState } from 'react'
import BasicNotification from '../../components/notifications/BasicNotification'

import { useDispatch } from 'react-redux'
import { setMessage } from '../../redux/actions/messageActions'
import { basicMessages } from '../../util/messages'

import '../../styles/notifications.scss'

import axios from 'axios'

export default function NotificationControls() {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState(null)
    const dispatch = useDispatch()
    useEffect(() => {
        setIsLoading(true)
        axios({
            type: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/notifications_states`,
        })
            .then((response) => {
                setValues(response.data.data)
            })
            .catch(() => {
                dispatch(setMessage(basicMessages.requestError))
            })
            .finally(() => setIsLoading(false))
    }, [])
    return (
        <div className="notification-controls">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h5 className="page-title mb-0 font-size-18">
                                Notification Controls
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={['amount']}
                        returnPropertyNames={['unstake']}
                        isEnabledPropertyName="unstake"
                        path={'/change_unstake'}
                        title="Unstake monitoring"
                        text="Notify about unstakings for
                        more than ___ OHM"
                        status={1}
                    />
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={['amount']}
                        returnPropertyNames={['dao_transfer']}
                        isEnabledPropertyName="dao_transfer"
                        path={'/change_dao_transfer'}
                        title="DAO balance monitoring"
                        text="Notify about withdrawals from the DAO contract for
                        more than ___ OHM"
                        status={2}
                    />
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={['amount']}
                        returnPropertyNames={['transfer']}
                        isEnabledPropertyName="transfer"
                        path={'/change_large_transfer'}
                        title="Transactions monitoring"
                        text="Notify about transactions for more than ___ OHM"
                        status={0}
                    />
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    DEX trading volume monitoring{' '}
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify when trading volume reaches{' '}
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="notification-input"
                                            />{' '}
                                            OHM
                                        </p>
                                    </div>
                                    <button className="btn btn-success change-button-notification">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={['amount']}
                        returnPropertyNames={['mint']}
                        isEnabledPropertyName="minting"
                        path={'/change_mint'}
                        title="Large minting monitoring"
                        text="Notify about mintings larger than ___ OHM"
                        status={1}
                    />
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Wallet lists balance monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about balance decrease more
                                            than{' '}
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="notification-input"
                                            />{' '}
                                            OHM from all wallet lists.
                                        </p>
                                    </div>
                                    <button className="btn btn-success change-button-notification">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={[]}
                        returnPropertyNames={[]}
                        isEnabledPropertyName="minter_role"
                        path={null}
                        title="Monitoring changes in the token contract's minter role"
                        text="Notify when the minter's
                        address changes in the token contract"
                        status={2}
                    />
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Monitoring of parameters affecting the APY
                                    and Bonds
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about changes in BCV and
                                            Reward Rate parameters
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={[
                            'amount_dai',
                            'amount_frax',
                            'amount_weth',
                            'amount_lusd',
                        ]}
                        returnPropertyNames={[
                            'reserves_dai',
                            'reserves_frax',
                            'reserves_weth',
                            'reserves_lusd',
                        ]}
                        isEnabledPropertyName="treasury_balance"
                        path={'/change_reserves'}
                        title="Treasury balance monitoring"
                        text="Notify about withdrawal from Treasury for more than ___ DAI, ___ FRAX, ___ WETH, ___ LUSD"
                        status={1}
                    />
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Monitoring the DAO offers
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about new offers received in
                                            the DAO
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <BasicNotification
                        isInitialValueLoading={isLoading}
                        currentValues={values}
                        propertyNames={[]}
                        returnPropertyNames={[]}
                        isEnabledPropertyName="change_role"
                        path={null}
                        title="Treasury role changes monitoring"
                        text="Notify about changes in key Treasury
                        management roles"
                        status={1}
                    />
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    OHM price monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify of a drop in the OHM price by
                                            more than{' '}
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="notification-input"
                                            />{' '}
                                            OHM
                                        </p>
                                    </div>
                                    <button className="btn btn-success change-button-notification">
                                        Save
                                    </button>
                                </div>
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            percentages for
                                        </p>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="form-control input-number"
                                            />
                                            {/* <span class="input-group-btn-vertical">
                                                    <button class="btn bx bx-caret-up" type="button"></button>
                                                    <button class="btn bx bx-caret-down" type="button"></button>
                                                </span> */}
                                        </div>
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
