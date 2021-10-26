import React from 'react'
import Message from './Message'

import { useSelector } from 'react-redux'

import '../../styles/messages.scss'

export default function Messages() {
    const messages = useSelector((state) => state.messages.data)
    return (
        <div className="status-messages">
            {messages.map((m) => (
                <Message
                    key={m.id}
                    id={m.id}
                    severity={m.severity}
                    text={m.text}
                />
            ))}
        </div>
    )
}
