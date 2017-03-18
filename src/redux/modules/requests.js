import fetch from 'isomorphic-fetch'
import Immutable from 'immutable'
import moment from 'moment'

const delay = async (ms) => {
  // if i return the promise, then the await is optional
  await new Promise((resolve) => setTimeout(resolve.bind(this, 'hi there'), ms))
  // await setTimeout(console.log.bind(this,'hi there'), ms)
  return 'here you go'
}

export const constants = {
  FETCH: 'Requests/FETCH',
  FETCH_SUCCESS: 'Requests/FETCH_SUCCESS',
  FETCH_FAILURE: 'Requests/FETCH_FAILURE',
  REMOVE_REQUEST: 'Requests/REMOVE_REQUEST',
  CHANGE_STATUS: 'Requests/CHANGE_STATUS',
  EDIT: 'Requests/EDIT',
  ADD: 'Requests/ADD'
}

export const actions = {
  fetchRequests() {
    return async (dispatch, getState) => {
      const requests = getState().requests.get('requests')
      if (requests.size){
        dispatch({ type: constants.FETCH_SUCCESS, requests: requests.toJS() })
        return
      }
      try {
        dispatch({ type: constants.FETCH })
        console.log('start delay')
        const nothing = await delay(1000)
        console.log('nothing', nothing)
        const response = await fetch('requests.json')
        // const response = await fetch('/graphql', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Accept: 'application/json'
        //   },
        //   body: JSON.stringify({
        //     query: `
        //       {
        //         requests (sortBy: ID) {
        //           id
        //           status
        //           title
        //           createdAt
        //           updatedAt
        //         }
        //       }
        //     `
        //   })
        // })
        if (response.status >= 300) throw new Error(response.status)
        const requests = await response.json()
        // dispatch(this.fetchSuccess(requests.data.requests))
        dispatch(this.fetchSuccess(requests))
      } catch (error) {
        dispatch({ type: constants.FETCH_FAILURE, error })
      }
    }
  },
  fetchSuccess(requests) {
    return { type: constants.FETCH_SUCCESS, requests }
  },
  deleteRequest(id){
    return { id: id, type: constants.REMOVE_REQUEST }
  },
  setStatus(id, newStatus){
    return {
      id: id,
      status: newStatus,
      updatedAt: moment().format('x'),
      type: constants.CHANGE_STATUS
    }
  },
  editRequest({id, status, title}) {
    return {
      id: id,
      status: status,
      title: title,
      updatedAt: moment().format('x'),
      type: constants.EDIT
    }
  },
  addRequest({status, title}) {
    return {
      id: (new Date().getTime()).toString(),
      status: status,
      title: title,
      updatedAt: moment().format('x'),
      createdAt: moment().format('x'),
      type: constants.ADD
    }
  }
}

const initialState = Immutable.fromJS({
  loading: false,
  requests: []
})

// My requests Reducer - rootReducer
export default function(state = initialState, action = {}) {
  switch (action.type) {
    case constants.FETCH:
      // return {
      //   ...state,
      //   loading: true,
      //   error: undefined
      // }
      return state.set('loading', true).set('error', undefined)
    case constants.FETCH_SUCCESS:
      // return {
      //   ...state,
      //   loading: false,
      //   requests: action.requests || []
      // }
      return state
        .set('loading', false)
        .set('requests', Immutable.fromJS(action.requests))
    case constants.FETCH_FAILURE:
      // return {
      //   ...state,
      //   loading: false,
      //   error: action.error
      // }
      return state.set('loading', false).set('error', action.error)
    case constants.REMOVE_REQUEST:
      // const index = state.get('requests').findIndex( rqst => rqst.get("id") === +action.id)
      // return {
      //   loading: false,
      //   requests: [
      //     ...state.requests.slice(0, index),
      //     ...state.requests.slice(index + 1)
      //   ]
      // }
      return state
        .set('loading', false)
        // .deleteIn(['requests', index])
        .updateIn(['requests'],
          requests => requests.filter(
            rqst => rqst.get('id') !== action.id
          )
        )
    case constants.CHANGE_STATUS:
      // return {
      //   loading: false,
      //   requests: state.requests.map( st => {
      //     if (+st.id !== +action.id) return st;
      //     return {
            //   ...st,
            //   status: action.status,
            //   updated_at: action.updated_at
            // }
      //   })
      // }
      return state
        .set('loading', false)
        .updateIn(['requests'], requests => {
          return requests.map(rqst => {
            return (rqst.get('id') === action.id)
              ? rqst
                .set('status', action.status)
                .set('updatedAt', action.updatedAt)
              : rqst
          })
        })
    case constants.EDIT:
      // return {
      //   loading: false,
      //   requests: state.requests.map( st => {
      //     if (+st.id !== +action.id) return st;
      //     return {
      //       ...st,
      //       status: action.status,
      //       updated_at: action.updated_at,
      //       title: action.title
      //     }
      //   })
      // }
      return state
        .set('loading', false)
        .updateIn(['requests'], requests => {
          return requests.map(rqst => {
            return (rqst.get('id') === action.id)
              ? rqst.set('status', action.status)
                .set('status', action.status)
                .set('updatedAt', action.updatedAt)
                .set('title', action.title)
              : rqst
          })
        })
    case constants.ADD:
      return state
        .set('loading', false)
        .updateIn(['requests'], requests => {
          return requests.push(
            Immutable.Map()
              .set('id', action.id)
              .set('status', action.status)
              .set('updatedAt', action.updatedAt)
              .set('createdAt', action.createdAt)
              .set('title', action.title)
          )
        })
    default:
      return state
  }
}
