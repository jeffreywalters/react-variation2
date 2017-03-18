import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { provideHooks, trigger } from 'redial'
import { Router, Route, IndexRoute, browserHistory, match } from 'react-router'
import Immutable from 'immutable'
import { actions as requestActions } from './redux/modules/requests.js'
import LayoutContainer from './containers/LayoutContainer'
import DetailsContainer from './containers/DetailsContainer'
import RequestsContainer from './containers/RequestsContainer'
import EditRequestContainer from './containers/EditRequestContainer'
import AddRequestContainer from './containers/AddRequestContainer'
import createStore from './redux/createStore'

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}

// const initialState = window.__INITIAL_STATE__ && Immutable.fromJS(JSON.stringify(window.__INITIAL_STATE__))
const initialState = window.__INITIAL_STATE__ && { requests: Immutable.fromJS(window.__INITIAL_STATE__) }
console.log(initialState)
const reduxStore = createStore(initialState)
const { dispatch } = reduxStore

const hooks = {
  defer: ({ dispatch }) => dispatch(requestActions.fetchRequests(dispatch, reduxStore.getState))
}
const hookedRequestsPage = provideHooks(hooks)(RequestsContainer)

const routes = (
  <Route path='/' component={LayoutContainer}>
    <IndexRoute component={hookedRequestsPage} />
    <Route path='/details/:id' component={DetailsContainer} />
    <route path='/edit/:id' component={EditRequestContainer} />
    <route path='/add' component={AddRequestContainer} />
  </Route>
)

// Listen for route changes on the browser history instance:
browserHistory.listen(location => {
  // Match routes based on location object:
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) console.log(error)
    // Get array of route handler components:
    const { components } = renderProps

    // Define locals to be provided to all lifecycle hooks:
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,

      // Allow lifecycle hooks to dispatch Redux actions:
      dispatch
    }

    // Don't fetch data for initial route, server has already done the work:
    if (window.__INITIAL_STATE__) {
      // Delete initial data so that subsequent data fetches can occur:
      delete window.__INITIAL_STATE__
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      trigger('fetch', components, locals)
    }

    // Fetch deferred, client-only data dependencies:
    trigger('defer', components, locals)
  })
})

// kick off first fetch
// browserHistory.push('/')

const App = () => (
  <Provider store={reduxStore}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
)

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()
