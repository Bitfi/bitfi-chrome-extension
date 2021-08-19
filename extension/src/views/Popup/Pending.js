import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import satoshi from '../../logic/utils/satoshi'
import { removePending } from '../../redux/actions'
import background from '../../logic/api/message-broker'
import { checkApprove, request } from '../../logic/api/bitfi-server'
import { BITFI_LOCALSTORAGE_KEY } from '../../config'
import bigInt from 'big-integer'

const REQUEST_DELAY = 1000 * 5
const DEFAULT_GAS_LIMIT = 21000

export default function Pending({ user }) {
  const { from, to, type, amount, gasPrice, gasLimit } = useSelector(state => state.request.pending[0])

  const feeSat = bigInt(gasPrice.sat).multiply(bigInt(gasLimit)).toString()
  const fee = {
    sat: feeSat,
    btc: satoshi.from(feeSat, 18).toString()
  }
      

  const [ lastReqTime, setLastReqTime ] = useState(0)
  const [ refreshing, setRefreshing] = useState(false)
  const [ now, setNow ] = useState(Date.now()) 
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const secsUntilNewReq = parseInt((lastReqTime + REQUEST_DELAY - now) / 1000)
  const canRequest = secsUntilNewReq <= 0

  const dispatch = useDispatch()

  useEffect(() => {
    
    setNow(() => Date.now())

    const interval = setInterval(() => {
      setNow(() => Date.now())
    }, 1000)
    
    const timeout = 7000
    const startTime = Date.now()
    
    /*
    const updateInterval = setInterval(async () => {
      setRefreshing(true)

      if (startTime + timeout < Date.now()) {
        const result = await checkApprove({ deviceID: user.deviceID })
        await background.sendMessage.txCompleted({ data: result })
        clearInterval(updateInterval)
        dispatch(removePending())
      }
      setTimeout(() => setRefreshing(false), 1000)
      
    }, 3000)
    */

    return () => {
      clearInterval(interval)
      //clearInterval(updateInterval)
    }
  }, [])

  const onRequest = async () => {
    try {
      setLoading(true)

      const info = {
        to,
        from: user.address,
        symbol: 'xdc',
        amount,
        fee: gasPrice,
        addition: {
          gasLimit: gasLimit,
          feePriority: 'Medium',
        }
      }
      const response = await request(user.token, 'Transfer', { info })
      setLoading(false)
      setLastReqTime(Date.now())
      dispatch(removePending())
      await background.sendMessage.txCompleted({ data: { response } })
    }
    catch (exc) {
      setLoading(false)
      setError(exc.message || 'Something went wrong, please, try again')
      console.log(exc)
    }
  }

  return (
    <div className="text-center w-100">
      {refreshing && <div>...refreshing...</div>}

      
      <h3 className="mt-0 pt-0">
        <strong>SIGN REQUEST</strong>
      </h3>
      <p className="m-0">
        The request will be sent to your bitfi device
      </p>
      <br/>

      <div class="alert alert-warning pb-1 pt-1" role="alert">
        <h1><strong>{format.btc(amount.btc, 3, 'XDC')}</strong></h1>
        <p className="m-0">fee: {format.btc(fee.btc, 7, '')}</p>
      </div>
      


      <div class="alert alert-warning pt-1 pb-1" role="alert">
        <p className="m-0"><strong>TO</strong></p>
        <p className="m-0" style={{ wordWrap: 'break-word'}}>{to}</p>
      </div>

{
      <div class="alert alert-secondary pt-1 pb-1" role="alert">
      <p className="m-0"><strong>FROM</strong></p>
      <p className="m-0" style={{ wordWrap: 'break-word'}}>{from}</p>
    </div>
}
        <button 
          
          className={`w-100 button-primary mt-0 ${canRequest && !loading? '' : 'disabled'} `}
          onClick={onRequest}
        >
          SEND REQUEST {canRequest? '' : `(${secsUntilNewReq})` }
        </button>
        <button 
          onClick={async () => {
            dispatch(removePending())
            await background.sendMessage.txCompleted({ error: 'Tx rejected' })
          }}
          className="w-100 button-primary mt-2"
        >
          REJECT
        </button>


      {
        error &&
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      }
    </div>
  )
}