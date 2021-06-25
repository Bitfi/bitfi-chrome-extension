import { 
  ADD_PENDING_REQ,
  INIT, 
  LOGIN, 
  LOGOUT, 
  REMOVE_PENDING_REQ, 
  REQ_TYPE, 
  RESET, 
} from './types';

export const loginAction = ({ token, address, deviceId }) => ({
  type: LOGIN,
  data: {
    token,
    address,
    deviceId
  }
})

export const resetAction = () => ({ type: RESET })
export const initAction = ({ encrypted }) => ({ type: INIT, data: { encrypted }})
export const logoutAction = () => ({ type: LOGOUT })

export const removePending = () => ({
  type: REMOVE_PENDING_REQ
})

export const addPending = (params) => ({
  type: ADD_PENDING_REQ,
  data: {
    params
  }
})
