import React, { useEffect, useState } from 'react'

import NotificationType from '../../components/notifications/NotificationType'

import '../../styles/notifications.scss'

import axios from 'axios'

export default function NotificationControls() {
    const [isLoading, setIsLoading] = useState(false)
    const [values, setValues] = useState(null)
    useEffect(() => {
        setIsLoading(true)
        axios({
            type: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/notifications_states`,
        })
            .then((response) => {
                setValues(response.data.data)
            })
            .catch((error) => console.error(error))
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
                    <NotificationType
                        isInitialValueLoading={isLoading}
                        currentValue={values ? values.unstake : ''}
                        propertyTitle="unstake"
                        path={'/change_unstake'}
                        title="Unstake monitoring"
                        text="Notify about unstakings for
                        more than ___ OHM"
                        status={1}
                    />
                    <NotificationType
                        isInitialValueLoading={isLoading}
                        currentValue={values ? values.dao_transfer : ''}
                        propertyTitle="dao_transfer"
                        path={'/change_dao_transfer'}
                        title="DAO balance monitoring"
                        text="Notify about withdrawals from the DAO contract for
                        more than ___ OHM"
                        status={2}
                    />
                </div>
                <div className="row">
                    <NotificationType
                        isInitialValueLoading={isLoading}
                        currentValue={values ? values.transfer : ''}
                        propertyTitle="transfer"
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
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Large minting monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about mintings larger that{' '}
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
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-danger">
                                        Danger
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Monitoring changes in the minter's role
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Receive notification when minter's
                                            wallet changes in the token contract
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Treasury balance monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about the withdrawal from the
                                            Treasury more than{' '}
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="notification-input"
                                            />{' '}
                                            USD
                                        </p>
                                    </div>
                                    <button className="btn btn-success change-button-notification">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Role change monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about changes in key Treasury
                                            management roles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                <div className="row">
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
                                            percentages for{' '}
                                            <input
                                                type="text"
                                                defaultValue={10}
                                                className="notification-input"
                                            />{' '}
                                        </p>
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
