import { BITFI_LOCALSTORAGE_KEY } from '../../config'

export async function isAccountCreated() {
  
  const item = localStorage.getItem(BITFI_LOCALSTORAGE_KEY)
  return item !== null
}