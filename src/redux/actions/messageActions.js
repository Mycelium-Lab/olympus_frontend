import { SET_MESSAGE, CLEAR_MESSAGE } from '../types'

export const setMessage = (message) => ({
    type: SET_MESSAGE,
    payload: { message },
})

export const clearMessage = (message_id) => ({
    type: CLEAR_MESSAGE,
    payload: { message_id },
})
