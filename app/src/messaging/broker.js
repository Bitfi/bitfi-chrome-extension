import { subjects, status } from './types'
import { request } from './primitives'

export async function getStatus() {
  const subject = subjects.GET_STATUS
  
  try {
    const response = await request(subject)
    return response.response
  }
  catch (exc) {
    console.log(exc)
    return status.NOT_INSTALLED
  }
}

export async function getAccount() {
  const subject = subjects.GET_ACCOUNT
  
  const account = await request(subject)

  return account.response
}