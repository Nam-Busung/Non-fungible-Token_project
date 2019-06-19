import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import customReducer from "./reducers/customReducer";

const reducer = combineReducers({
    customReducer: customReducer,
    routing: routerReducer,
    ...drizzleReducers
})

export default reducer
