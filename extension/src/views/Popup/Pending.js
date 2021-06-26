import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import { removePending } from '../../redux/actions'
import background from '../../logic/api/message-broker'
import { checkApprove } from '../../logic/api/bitfi-server'

const REQUEST_DELAY = 1000 * 5

export default function Pending({ from, to, type, amount, user }) {
  const [ lastReqTime, setLastReqTime ] = useState(0)
  const [ refreshing, setRefreshing] = useState(false)
  const [ now, setNow ] = useState(Date.now()) 

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
    

    return () => {
      clearInterval(interval)
      clearInterval(updateInterval)
    }
  }, [])

  const onRequest = () => {
    setLastReqTime(Date.now())
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
          className={`w-100 button-primary ${canRequest? '' : 'disabled'} `}
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
    </div>
  )
}