import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'

const statuses = ['info', 'warning', 'danger']

const validateValues = (values) => {
    let valid = true
    values.forEach((value) => {
        const pv = parseInt(value)
        if (isNaN(pv) || pv < 0) {
            valid = false
            return
        }
    })
    return valid
}

const setValuesFromCurrent = (currentValues, returnPropertyNames) => {
    return currentValues
        ? returnPropertyNames.map((key) => currentValues[key])
        : Array(returnPropertyNames.length).fill('')
}

export default function BasicNotification({
    isInitialValuesLoading,
    currentValues,
    path,
    propertyNames,
    returnPropertyNames,
    title,
    text,
    status,
}) {
    const [values, setValues] = useState(
        setValuesFromCurrent(currentValues, returnPropertyNames)
    )
    const [isLoading, setIsLoading] = useState(isInitialValuesLoading)

    const splitText = text.split('___')

    useEffect(() => {
        if (isInitialValuesLoading !== isLoading)
            setIsLoading(isInitialValuesLoading)
    }, [isInitialValuesLoading])

    useEffect(() => {
        if (currentValues) {
            setValues(returnPropertyNames.map((key) => currentValues[key]))
        }
    }, [currentValues])

    const applyValuesChange = () => {
        if (validateValues(values)) {
            setIsLoading(true)
            axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/api${path}`,
                data: propertyNames.reduce((acc, key, idx) => {
                    acc[key] = values[idx]
                    return acc
                }, {}),
            })
                .then((response) => {
                    const data = response.data.data
                    let isChangedSuccessfully = true
                    returnPropertyNames.forEach((key, idx) => {
                        if (data[key] !== parseInt(values[idx])) {
                            isChangedSuccessfully = false
                            return
                        }
                    })
                    if (isChangedSuccessfully) {
                        alert('Values changed successfully.')
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
        } else {
            alert('Please make sure you fields are filled correctly.')
        }
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
                                {splitText.map((text, idx) => (
                                    <Fragment key={idx}>
                                        {text}
                                        {idx !== splitText.length - 1 && (
                                            <input
                                                onChange={(e) =>
                                                    setValues(
                                                        values.map((a, i) =>
                                                            idx !== i
                                                                ? a
                                                                : e.target.value
                                                        )
                                                    )
                                                }
                                                type="number"
                                                value={values[idx]}
                                                className="notification-input"
                                            />
                                        )}
                                    </Fragment>
                                ))}
                            </p>
                        </div>
                        <button
                            disabled={isLoading}
                            onClick={applyValuesChange}
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
