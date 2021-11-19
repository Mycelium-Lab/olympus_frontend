import React from 'react'
import { Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import parse from 'html-react-parser'

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
        '& > a': {
            color: 'rgba(0, 163, 245, 0.99)',
        },
        '& > a:focus, a:hover, a:active': {
            color: 'rgba(0, 163, 245, 0.8)',
        },
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
                    title={info !== null ? parse(info) : info}
                >
                    {children}
                </Tooltip>
            ) : (
                children
            )}
        </>
    )
}
