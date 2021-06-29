import axios from 'axios'
import {useState, useEffect} from 'react'
import satoshi from '../utils/satoshi'

export default (account) => {
  const [balance, setBalance] = useState()

  const fetchBalance = async () => {
    try {
      const { data: res } = await axios(`https://explorer.xinfin.network/publicAPI?module=account&action=balance&address=${account}&tag=latest&apikey=YourApiKeyToken`)
      if (res.result && res.message === "OK") {
        setBalance({
          sat: res.result,
          btc: satoshi.from(res.result, 18)
        })
      }
    }
    catch (exc) {

    }
  }

  useEffect(async () => {
    await fetchBalance()
    const interval = setInterval(async () => {
      await fetchBalance()
    }, 3000)
    
    return () => {
      clearInterval(interval)
    }
  }, [account])

  return {
    balance
  }
}
