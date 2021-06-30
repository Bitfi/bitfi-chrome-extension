import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import { removePending } from '../../redux/actions'
import background from '../../logic/api/message-broker'
import { checkApprove, request } from '../../logic/api/bitfi-server'
import { BITFI_LOCALSTORAGE_KEY } from '../../config'

const REQUEST_DELAY = 1000 * 5

export default function Pending({ from, to, type, amount, fee, user }) {
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
      const response = await request(user.token, 'Transfer', {
        data: {
          info: {
            to,
            from: user.address,
            symbol: 'XDC',
            amount: {
              sat: '124134134134',
              btc: '0.1'
            }
          }
        }
      })

      console.log(response)
      setLastReqTime(Date.now())
      dispatch(removePending())
    }
    catch (exc) {
      setError(exc.message || 'Something went wrong, please, try again')
      console.log(exc)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center w-100">
      {refreshing && <div>...refreshing...</div>}

      
      <h3>
        Sign Request
      </h3>
      <br/>

      <p>from: {format.address(from)}</p>
      <p>to: {format.address(to)}</p>
      <p>amount: {amount}</p>
      <p>deviceID: {user.deviceID}</p>

        <button 
          
          className={`w-100 button-primary ${canRequest || loading? '' : 'disabled'} `}
          onClick={onRequest}
        >
          SEND REQUEST {canRequest? '' : `(${secsUntilNewReq})` }
        </button>
        <button 
          onClick={async () => {
            dispatch(removePending())
            await background.sendMessage.txCompleted({ error: 'Tx rejected' })
          }}
          className="w-100 button-primary"
        >
          REJECT
        </button>


      {
        error &&
        <div class="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      }
    </div>
  )
}