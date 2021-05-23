import {
  LOGIN,
  LOGOUT,
  RESET,
  INIT
} from './types'
import { combineReducers } from 'redux';

const authInitState = {
  user: false, //decrypted user data 
  encrypted: false //encrypted user data, user needs to provide a password for decryption
}

function auth(state = authInitState, action) {
  switch (action.type) {
    /*
    case LOGIN:
      return {
        ...state,
        user: {
          address: action.data.address,
          token: action.data.token
        }
      }
    case LOGOUT:
      return {
        ...state,
        user: null
      }
    */
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

export default combineReducers({
  auth
})