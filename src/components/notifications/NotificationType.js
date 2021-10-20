import React, { useState, useEffect } from 'react'
import axios from 'axios'

const statuses = ['info', 'warning', 'danger']

export default function NotificationType({
    isInitialValueLoading,
    currentValue,
    path,
    propertyTitle,
    title,
    text,
    status,
}) {
    const [value, setValue] = useState(currentValue)
    const [isLoading, setIsLoading] = useState(isInitialValueLoading)

    const splitText = text.split('___')

    useEffect(() => {
        if (isInitialValueLoading !== isLoading)
            setIsLoading(isInitialValueLoading)
    }, [isInitialValueLoading])

    useEffect(() => {
        if (currentValue !== value) setValue(currentValue)
    }, [currentValue])

    const applyValueChange = () => {
        setIsLoading(true)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api${path}`,
            data: {
                amount: value,
            },
        })
            .then((response) => {
                if (response.data.data[propertyTitle] === parseInt(value)) {
                    alert('Value changed successfully.')
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
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="col-md-6">
            <div className="card notification-card">
                <div className="card-body">
                    <div className="float-right">
                        <div
                            className={`notification notification-${statuses[status]}`}
                        >
                            Danger
                        </div>
                    </div>
                    <h5 className="card-title">{title}</h5>
                    <p />
                    <hr className="notification-hr" />
                    <div className="notification-desc">
                        <div className="notification-desc-left">
                            <p className="notification-text">
                                {splitText[0]}
                                <input
                                    onChange={(e) => setValue(e.target.value)}
                                    type="text"
                                    value={value}
                                    className="notification-input"
                                />{' '}
                                {splitText[1]}
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
