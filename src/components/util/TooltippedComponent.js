import React from 'react'
import { Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(() => ({
    arrow: {
        '&:before': {
            backgroundColor: '#2a3142 !important',
        },
    },
    tooltip: {
        textAlign: 'center',
        backgroundColor: '#2a3142 !important',
        marginBottom: '5px !important',
    },
}))

export default function TooltippedComponent({ info, children }) {
    const classes = useStyles()
    return (
        <>
            {info ? (
                <Tooltip
                    classes={classes}
                    leaveDelay={100}
                    enterDelay={100}
                    placement="top"
                    arrow={true}
                    title={info}
                >
                    {children}
                </Tooltip>
            ) : (
                children
            )}
        </>
    )
}
