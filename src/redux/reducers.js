import { combineReducers } from 'redux'
import dashboardReducer from './reducers/dashboardReducer'
import gaReducer from './reducers/gaReducer'
import messageReducer from './reducers/messageReducer'

const reducers = combineReducers({
    messages: messageReducer,
    ga: gaReducer,
    dashboard: dashboardReducer,
})

export default reducers
