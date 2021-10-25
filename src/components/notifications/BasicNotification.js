import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Switch } from '@mui/material'

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

export default function BasicNotification({
    isInitialValuesLoading,
    currentValues,
    path,
    propertyNames,
    returnPropertyNames,
    isEnabledPropertyName,
    title,
    text,
    status,
}) {
    const [isEnabled, setIsEnabled] = useState(false)
    const [values, setValues] = useState(
        Array(returnPropertyNames.length).fill('')
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
            setIsEnabled(Boolean(currentValues.states[isEnabledPropertyName]))
        }
    }, [currentValues])

    const applyIsEnabledChange = (e) => {
        const newIsEnabled = e.target.checked
        setIsEnabled(newIsEnabled)
        setIsLoading(true)
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/set_states`,
            data: {
                [isEnabledPropertyName]: +newIsEnabled,
            },
        })
            .then((response) => {
                const { states } = response.data.data
                if (states[isEnabledPropertyName] !== +newIsEnabled) {
                    setIsEnabled(!newIsEnabled)
                    alert('Cannot apply this change. Please try again later.')
                }
            })
            .catch((err) => {
                console.error(err)
                setIsEnabled(!newIsEnabled)
                alert('Cannot apply this change. Please try again later.')
            })
            .finally(() => setIsLoading(false))
    }

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
                    const { data } = response.data
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
                            {statuses[status]}
                        </div>
                    </div>
                    <h5 className="card-title">{title}</h5>
                    <p />
                    <hr className="notification-hr" />
                    <div className="notification-desc">
                        <div className="notification-desc-left">
                            <p className="notification-text">
                                {splitText.length < 2
                                    ? splitText[0]
                                    : splitText.map((text, idx) => (
                                          <Fragment key={idx}>
                                              {text}
                                              {idx !== splitText.length - 1 && (
                                                  <input
                                                      onChange={(e) =>
                                                          setValues(
                                                              values.map(
                                                                  (a, i) =>
                                                                      idx !== i
                                                                          ? a
                                                                          : e
                                                                                .target
                                                                                .value
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
                        <div className="notification-desc-right">
                            {path && (
                                <button
                                    disabled={
                                        isLoading || currentValues == null
                                    }
                                    onClick={applyValuesChange}
                                    className="btn btn-success change-button-notification"
                                >
                                    Save
                                </button>
                            )}
                            <Switch
                                disabled={isLoading || currentValues == null}
                                checked={isEnabled}
                                onChange={(e) => applyIsEnabledChange(e)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
