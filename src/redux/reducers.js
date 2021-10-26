import { combineReducers } from 'redux'
import messageReducer from './reducers/messageReducer'

const reducers = combineReducers({
    messages: messageReducer,
})

export default reducers
