import useBitfi from './useBitfi'
import { useState, useEffect } from 'react'


export default (intervalMsec = 3000) => {
  const [account, setAccount] = useState(null)
  const bitfi = useBitfi()
  let updateInterval = null
  
  const updateAccount = async () => {
    try {
      if (bitfi) {
        const account = await bitfi.getAccount()
        setAccount(account)
      }
    }
    catch (exc) {
      console.log(exc)
      setAccount(null)
    }
  } 

  useEffect(async () => { 
    await updateAccount()
    
    clearInterval(updateInterval)
    updateInterval = setInterval(updateAccount, intervalMsec)

    return () => {
      clearInterval(updateInterval)
    }
  }, [bitfi])

  return account
}





