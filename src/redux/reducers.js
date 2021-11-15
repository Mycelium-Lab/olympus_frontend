import { combineReducers } from 'redux'
import gaReducer from './reducers/gaReducer'
import messageReducer from './reducers/messageReducer'

const reducers = combineReducers({
    messages: messageReducer,
    ga: gaReducer,
})

export default reducers
