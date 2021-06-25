import {
  RESET,
  INIT,
  ADD_PENDING_REQ,
  REMOVE_PENDING_REQ
} from './types'
import { combineReducers } from 'redux';

const authInitState = {
  user: false, //decrypted user data 
  encrypted: false //encrypted user data, user needs to provide a password for decryption
}

function auth(state = authInitState, action) {
  switch (action.type) {
    case RESET:
      return {
        ...authInitState
      }
    case INIT: {
      return {
        ...authInitState,
        encrypted: action.data.encrypted
      }
    }
    default:
      return state
  }
}

const defaultRequest = {
  pending: [],
  pendingEmpty: true
}

function request(state = defaultRequest, action) {
  switch (action.type) {
    case ADD_PENDING_REQ: {
      return {
        pending: [{
          ...action.data.params
        }],
        pendingEmpty: false
      }
    }
    case RESET:
    case REMOVE_PENDING_REQ:
      return {
        ...defaultRequest
      }
    
    default:
      return state
  }
}

export default combineReducers({
  auth,
  request
})