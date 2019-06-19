import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import { generateContractsInitialState } from 'drizzle'

import drizzleOptions from './drizzleOptions'
import reducer from './reducer'
import rootSaga from './rootSaga'

const history = createHistory()
const routingMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware()

const initialState = {
    contracts: generateContractsInitialState(drizzleOptions)
}

const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(
            routingMiddleware,
            sagaMiddleware
        )
    )
)

sagaMiddleware.run(rootSaga)

export { history }

export default store
