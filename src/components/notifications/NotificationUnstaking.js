import React, { useState } from 'react'
import axios from 'axios'

export default function NotificationUnstaking() {
    const [value, setValue] = useState(
        localStorage.getItem('notification_unstaking')
            ? parseInt(localStorage.getItem('notification_unstaking'))
            : 100
    )
    const [isLoading, setIsLoading] = useState(false)

    const applyValueChange = () => {
        setIsLoading(true)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/change_unstake`,
            data: {
                amount: value,
            },
        })
            .then((response) => {
                if (response.data.data.unstake === parseInt(value)) {
                    localStorage.setItem(
                        'notification_unstaking',
                        response.data.data.unstake
                    )
                    alert('Unstaking value changed successfully.')
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
                        <div className="notification notification-warning">
                            Warning
                        </div>
                    </div>
                    <h5 className="card-title">Unstake monitoring</h5>
                    <p />
                    <hr className="notification-hr" />
                    <div className="notification-desc">
                        <div className="notification-desc-left">
                            <p className="notification-text">
                                Notify about unstaking more than{' '}
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
