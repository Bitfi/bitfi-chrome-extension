import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8'

const encrypt = (data, password) => AES.encrypt(JSON.stringify(data), password).toString()

const decrypt = (encrypted, password) => {
  const bytes = AES.decrypt(encrypted, password)
  const text = bytes.toString(encUtf8)
  return JSON.parse(text)
}

export default {
  encrypt,
  decrypt
}