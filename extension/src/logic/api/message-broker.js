const type = {
  LOGIN: 'LOGIN',
  GET_USER: 'GET_USER',
  LOGOUT: 'LOGOUT',
  SEND_TRANSACTION: 'SEND_TRANSACTION',
  TX_COMPLETED: 'TX_COMPLETED'
}

const sendMessage = type => data => new Promise((res, rej) => {
  chrome.runtime.sendMessage({ type, ...data }, result => {
    res(result)
  })
})

function isPromise(value) {
  return typeof value === 'object' && value !== null && 'then' in value && 'catch' in value;
}

const addListener = type => handler => {
  const callback = (msg, sender, reply) => {

    if (type === msg.type) {
      const returnValue = handler(msg, sender)
      if (isPromise(returnValue)) {
        returnValue.then(reply);
        return true;
      }
      else {
        if (typeof returnValue !== 'undefined') {
          reply(returnValue)
          return true
        }
        
        return false;
      }
    }
  }

  chrome.extension.onMessage.addListener(callback)

  return () => chrome.extension.onMessage.removeListener(callback)
}

export default {
  addListener: {
    getUser: addListener(type.GET_USER),
    login: addListener(type.LOGIN),
    logout: addListener(type.LOGOUT),
    sendTx: addListener(type.SEND_TRANSACTION),
    txCompleted: addListener(type.TX_COMPLETED)
  },

  sendMessage: {
    getUser: sendMessage(type.GET_USER),
    login: sendMessage(type.LOGIN),
    logout: sendMessage(type.LOGOUT),
    sendTx: sendMessage(type.SEND_TRANSACTION),
    txCompleted: sendMessage(type.TX_COMPLETED)
  }
}