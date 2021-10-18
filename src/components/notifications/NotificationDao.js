import React, { useState } from 'react'
import axios from 'axios'

export default function NotificationDAO() {
    const [value, setValue] = useState(
        localStorage.getItem('notification_dao_transfer')
            ? parseInt(localStorage.getItem('notification_dao_transfer'))
            : 100
    )
    const [isLoading, setIsLoading] = useState(false)

    const applyValueChange = () => {
        setIsLoading(true)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/change_dao_transfer`,
            data: {
                amount: value,
            },
        })
            .then((response) => {
                if (response.data.data.dao_transfer === parseInt(value)) {
                    localStorage.setItem(
                        'notification_dao_transfer',
                        response.data.data.dao_transfer
                    )
                    alert('Transfers value changed successfully.')
                } else {
                    alert(
                        'An error occured while processing you change request. Please try again later.'
                    )
                }
            })
            .catch((err) => {
                console.error(err)
                alert(
                    'An error occured while processing you change request. Please try again later.'
                )
            })

        setIsLoading(false)
    }

    return (
        <div className="col-md-6">
            <div className="card notification-card">
                <div className="card-body">
                    <div className="float-right">
                        <div className="notification notification-danger">
                            Danger
                        </div>
                    </div>
                    <h5 className="card-title">DAO balance monitoring</h5>
                    <p />
                    <hr className="notification-hr" />
                    <div className="notification-desc">
                        <div className="notification-desc-left">
                            <p className="notification-text">
                                Notify about the withdrawal from the DAO balance
                                more than{' '}
                                <input
                                    onChange={(e) => setValue(e.target.value)}
                                    type="text"
                                    defaultValue={value}
                                    className="notification-input"
                                />{' '}
                                OHM
                            </p>
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={applyValueChange}
                            className="btn btn-success change-button-notification"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
