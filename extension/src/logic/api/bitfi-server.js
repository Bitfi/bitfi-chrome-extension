import { MOCK_ACCOUNTS } from '../../config'

export const sendApprove = (deviceID) =>
  new Promise(res => {
    setTimeout(() => res({ ok: true, deviceID }), 1000)
  })

export const checkApprove = (deviceID) =>
  new Promise(res => {
    setTimeout(() => {
      console.log(`Making request to ${deviceID}`)
      const account = MOCK_ACCOUNTS.find(a => a.deviceID.toLowerCase() === deviceID.toLowerCase())
      if (account) {
        res({ ok: true, account, deviceID })
      } else {
        res({ ok: false, deviceID })
      }
    }, 1000)
  })

export const sign = (token) =>
  new Promise((res) => {
    setTimeout(() => res({ ok: true }))
  });
