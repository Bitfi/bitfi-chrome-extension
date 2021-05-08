import { INIT, LOGIN, LOGOUT, RESET } from './types';

export const loginAction = ({ token, address }) => ({
  type: LOGIN,
  data: {
    token,
    address
  }
})

export const resetAction = () => ({ type: RESET })
export const initAction = ({ encrypted }) => ({ type: INIT, data: { encrypted }})
export const logoutAction = () => ({ type: LOGOUT })
