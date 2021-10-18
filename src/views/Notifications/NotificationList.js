import React from 'react'

import '../../styles/notifications.scss'

export default function NotificationList() {
    return (
        <div className="notification-list">
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
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="notification-setting-container">
                            <div className="notification-settings">
                                <input
                                    type="date"
                                    className="form-control notification-settings-date"
                                    placeholder="mm/dd/yyyy"
                                    data-provide="datepicker"
                                    data-date-autoclose="true"
                                />
                                <select className="custom-select notification-settings-select">
                                    <option selected>All</option>
                                    <option value="info">Info</option>
                                    <option value="warning">Warning</option>
                                    <option value="danger">Danger</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="card notification-card notification-card-full-width">
                            <div className="card-body">
                                <div className="float-right notification-with-date">
                                    <span className="notification-date">
                                        07.10.21 20:02
                                    </span>
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Large minting monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    Transaction of 50 000 OHM performed from
                                    wallet 0xE8D562606... to wallet
                                    0xE0B14d3E8... .{' '}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="card notification-card notification-card-full-width">
                            <div className="card-body">
                                <div className="float-right notification-with-date">
                                    <span className="notification-date">
                                        07.10.21 20:02
                                    </span>
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Treasury balance monitoring
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    123 000 ETH withdrawal from Treasury (tx
                                    id).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="card notification-card notification-card-full-width">
                            <div className="card-body">
                                <div className="float-right notification-with-date">
                                    <span className="notification-date">
                                        07.10.21 20:02
                                    </span>
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Monitoring changes in the minter's role
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    Request to assign the Reserve Manager role
                                    to a new address has been added to the queue
                                    (tx id).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="card notification-card notification-card-full-width">
                            <div className="card-body">
                                <div className="float-right notification-with-date">
                                    <span className="notification-date">
                                        07.10.21 20:02
                                    </span>
                                    <div className="notification notification-danger">
                                        Danger
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Monitoring changes in the minter's role
                                </h5>
                                <p />
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    Token Minter role assigned to a new address
                                    (tx id).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9 ml-auto mr-auto">
                        <div className="card notification-card notification-card-full-width">
                            <div className="card-body">
                                <div className="float-right notification-with-date">
                                    <span className="notification-date">
                                        07.10.21 20:02
                                    </span>
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
                                <p className="notification-text">
                                    Reward Rate has been changed to 0.2975% (tx
                                    id).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
