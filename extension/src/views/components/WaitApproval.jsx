import React, { useState, useEffect } from 'react'
import { checkApprove } from '../../logic/api/bitfi-server'

export default function({ 
  className, frequencyMsec, deviceID, 
  onBack, onApproved, timeoutMsec 
}) {
  const [timeout, setTimeout] = useState(false)
  let checkInterval = null

  useEffect(() => {
    const timeout = timeoutMsec + Date.now()

    checkInterval = setInterval(async () => {
      try {
        if (Date.now() > timeout) {
          clearInterval(checkInterval)
          setTimeout(true)
          return
        } 

        const { ok, account } = await checkApprove({ deviceID })

        if (ok && account) {
          clearInterval(checkInterval)
          onApproved(account)
        }
      }
      catch (exc) {
        console.log(exc)
      }
    }, frequencyMsec)
    
    return () => {
      console.log('UNMOUNT')
      clearInterval(checkInterval)
    }
  })

  const renderTimeout = () => {
    return (
      <div>
        <h4>
          Oops Timeout!
        </h4>
        <p>
          please try again or use a different device ID
        </p>
        <div>
          <a href="#" onClick={onBack}>
            enter different device ID
          </a>
        </div>
      </div>
    )
  }

  if (timeout) {
    return renderTimeout()
  }

  return (
    <div className={`${className}`}>
      <h4 className="mb-0">
        Waiting for approval...
      </h4>
      <p>
        please, don't close your extension...
      </p>

      <p>
        DEVICE ID: {deviceID}
      </p>
      <div>
        <a href="#" onClick={onBack}>enter different device ID</a>
      </div>
    </div>
  )
}