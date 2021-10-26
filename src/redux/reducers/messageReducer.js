import { SET_MESSAGE, CLEAR_MESSAGE } from '../types'
import { v4 } from 'uuid'

const initialState = {
    data: [],
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_MESSAGE:
            return {
                ...state,
                data: [
                    ...state.data,
                    {
                        ...action.payload.message,
                        id: v4(),
                    },
                ],
            }
        case CLEAR_MESSAGE:
            return {
                ...state,
                data:
                    state.data.length === 0
                        ? state.data
                        : state.data.filter(
                              (e) => e.id !== action.payload.message_id
                          ),
            }
        default:
            return {
                ...state,
            }
    }
}
