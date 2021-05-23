import {  listen } from '../src/logic/messaging/primitives'
import { subjects, status } from '../src/logic/messaging/types'
import broker from '../src/logic/api/message-broker'

console.log('HELLO')
listen(subjects.GET_STATUS, async req => {
  const user = await broker.sendMessage.getUser()
  return user? status.READY : status.NOT_AUTHORIZED
})

listen(subjects.GET_ACCOUNT, async req => {
  const user = await broker.sendMessage.getUser()
  return user? user.address : undefined
})


