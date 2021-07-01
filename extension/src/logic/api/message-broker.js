const subjects = {
  getUser: 'LOGIN',
  login: 'GET_USER',
  logout: 'LOGOUT',
  sendTx: 'SEND_TRANSACTION',
  txCompleted: 'TX_COMPLETED',
  onExpand: 'ON_EXPAND'
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
  addListener: Object.entries(subjects).reduce(
    (acc, [method, subject]) => ({
      ...acc,
      [method]: addListener(subject)
    }), 
  {}),
  
  sendMessage: Object.entries(subjects).reduce(
    (acc, [method, subject]) => ({
      ...acc,
      [method]: sendMessage(subject)
    }), 
  {})
}