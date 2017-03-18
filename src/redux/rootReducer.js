import { combineReducers } from 'redux'
import requestsReducer from './modules/requests'
import { reducer as formReducer } from 'redux-form'
import { routerReducer as router } from 'react-router-redux'

const rootReducer = combineReducers({
  form: formReducer,
  requests: requestsReducer,
  router
})

export default rootReducer
