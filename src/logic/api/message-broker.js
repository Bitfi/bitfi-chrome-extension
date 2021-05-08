const type = {
  LOGIN: 'LOGIN',
  GET_USER: 'GET_USER',
  LOGOUT: 'LOGOUT'
}

const sendMessage = type => data => new Promise((res, rej) => {
  chrome.runtime.sendMessage({ type, ...data }, async user => res(user))
})

const addListener = type => handler => {
  console.log('HERE')
  chrome.extension.onMessage.addListener((msg, sender, reply) => {
    if (type === msg.type) 
      handler(msg, sender, reply)
  })
}

export default {
  addListener: {
    getUser: addListener(type.GET_USER),
    login: addListener(type.LOGIN),
    logout: addListener(type.LOGOUT)
  },

  sendMessage: {
    getUser: sendMessage(type.GET_USER),
    login: sendMessage(type.LOGIN),
    logout: sendMessage(type.LOGOUT)
  }
}