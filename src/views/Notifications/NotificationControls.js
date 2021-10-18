import React from 'react'

import '../../styles/notifications.scss'

export default function NotificationControls() {
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
                    <div className="col-md-6">
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-danger">
                                        Danger
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    DAO balance monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about the withdrawal from the
                                            DAO balance more than{' '}
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
                        <div className="card notification-card">
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
                <div className="row">
                    <div className="col-md-6">
                        <div className="card notification-card">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Transactions monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about transactions more than{' '}
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
                        <div className="card notification-card">
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
                        <div className="card notification-card">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Unstake monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <div className="notification-desc">
                                    <div className="notification-desc-left">
                                        <p className="notification-text">
                                            Notify about unstaking more than{' '}
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
            </div>
        </div>
    )
}
