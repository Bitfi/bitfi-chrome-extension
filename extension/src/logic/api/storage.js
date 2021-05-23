import { BITFI_LOCALSTORAGE_KEY, STORAGE_AREA } from '../../config'
import aes from '../utils/aes'

const defaultKey = BITFI_LOCALSTORAGE_KEY
const area = STORAGE_AREA

const promisify = f => new Promise((res, rej) => {
  f(_ => {
    var err = chrome.runtime.lastError
    if (err) 
      rej(err)
    else 
      res(_)
  })
})

const defaultEncryptor = aes

export default class Storage {
  constructor(key = defaultKey, encryptor = defaultEncryptor) {
    this.key = key
    this.encryptor = encryptor
  }

  set = (data, password) => {
    let obj = { data, encrypted: false }
    if (password) {
      const encrypted = this.encryptor.encrypt(data, password);
      obj = {
        data: encrypted,
        encrypted: true
      }
    }

    return promisify(cb => chrome.storage[area].set({ [this.key]: JSON.stringify(obj) }, cb))
  }
  
  remove = () => {
    return promisify(cb => chrome.storage[area].remove([this.key], cb))
  }

  isEmpty = async () => {
    const raw = await promisify(cb => chrome.storage[area].get([this.key], cb))
    return !raw[this.key] || Object.keys(raw[this.key]).length === 0
  }
  
  get = async (password) => {
    const raw = await promisify(cb => chrome.storage[area].get([this.key], cb))

    if (!raw[this.key] || Object.keys(raw[this.key]).length === 0)
      return undefined
    
    const obj = JSON.parse(raw[this.key])
    
    if (!obj.encrypted)
      return obj.data

    if (!obj.encrypted && password)
      throw new Error('Data is not encrypted, password is not required')

    if (obj.encrypted && !password)
      throw new Error('Data is encrypted, you need a password')

    try {
      var decrypted  = this.encryptor.decrypt(obj.data, password)
      return decrypted
    }
    catch (exc) {
      console.log(exc)
      throw new Error('Password is not correct')
    }
  }
}