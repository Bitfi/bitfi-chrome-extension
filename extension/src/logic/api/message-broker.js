const type = {
  LOGIN: 'LOGIN',
  GET_USER: 'GET_USER',
  LOGOUT: 'LOGOUT',
  SEND_TRANSACTION: 'SEND_TRANSACTION'
}

const sendMessage = type => data => new Promise((res, rej) => {
  chrome.runtime.sendMessage({ type, ...data }, async user => res(user))
})

const addListener = type => handler => {
  chrome.extension.onMessage.addListener((msg, sender, reply) => {
    if (type === msg.type) 
      handler(msg, sender, reply)
  })
}

export default {
  addListener: {
    getUser: addListener(type.GET_USER),
    login: addListener(type.LOGIN),
    logout: addListener(type.LOGOUT),
    sendTx: addListener(type.SEND_TRANSACTION)
  },

  sendMessage: {
    getUser: sendMessage(type.GET_USER),
    login: sendMessage(type.LOGIN),
    logout: sendMessage(type.LOGOUT),
    sendTx: sendMessage(type.SEND_TRANSACTION)
  }
}