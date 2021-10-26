import React, { useEffect, useState, useRef } from 'react'

import { Alert } from '@mui/material'

import { Transition } from 'react-transition-group'

import { clearMessage } from '../../redux/actions/messageActions'
import { useDispatch } from 'react-redux'

const getSeverity = (number) => {
    switch (number) {
        case 0:
            return 'success'
        case 1:
            return 'info'
        case 2:
            return 'warning'
        case 3:
            return 'error'
        default:
            return 'info'
    }
}

export default function Message({ id, severity, text }) {
    const nodeRef = useRef(null)
    const [isQuasiMounted, setIsQuasiMounted] = useState(false)
    const dispatch = useDispatch()

    const baseTimeout = 3000
    const delay = 200

    useEffect(() => {
        setIsQuasiMounted(true)
    }, [])

    useEffect(() => {
        const timeoutUnmount = setTimeout(() => {
            dispatch(clearMessage(id))
        }, baseTimeout + delay)

        const timeoutAnim = setTimeout(() => {
            setIsQuasiMounted(false)
        }, 3000)
        return () => {
            clearTimeout(timeoutUnmount)
            clearTimeout(timeoutAnim)
        }
    }, [id])
    return (
        <Transition
            nodeRef={nodeRef}
            mountOnEnter
            unmountOnExit
            timeout={delay}
            in={isQuasiMounted}
        >
            {(state) => {
                let className = state
                return (
                    <Alert
                        ref={nodeRef}
                        className={className}
                        severity={getSeverity(severity)}
                    >
                        {text}
                    </Alert>
                )
            }}
        </Transition>
    )
}
