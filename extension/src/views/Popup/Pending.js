import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import { removePending } from '../../redux/actions'
import background from '../../logic/api/message-broker'

const REQUEST_DELAY = 1000 * 5

export default function Pending({ from, to, type, amount, user }) {
  const [ lastReqTime, setLastReqTime ] = useState(0)
  const [ now, setNow ] = useState(Date.now()) 

  const secsUntilNewReq = parseInt((lastReqTime + REQUEST_DELAY - now) / 1000)
  const canRequest = secsUntilNewReq <= 0

  const dispatch = useDispatch()

  useEffect(() => {
    setNow(() => Date.now())
    const interval = setInterval(() => {
      setNow(() => Date.now())
    }, 1000)

    return () => clearInterval(interval)
  })

  const onRequest = () => {
    setLastReqTime(Date.now())
  }

  return (
    <div className="text-center w-100">
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
            await background.sendMessage.cancelTx()
          }}
          className="w-100 button-primary"
        >
          REJECT
        </button>
    </div>
  )
}