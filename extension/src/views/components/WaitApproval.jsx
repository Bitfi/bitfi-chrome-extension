import React, { useState, useEffect } from 'react'
import { checkApprove } from '../../logic/api/bitfi-server'

export default function({ 
  className, frequencyMsec, deviceID, 
  onBack, onApproved, timeoutMsec 
}) {
  const [timeout, setTimeout] = useState(false)
  const [secsLeft, setSecsLeft] = useState(timeoutMsec)
  let websocket = new WebSocket("wss://bitfi.com/NoxWSHandler/NoxWS.ashx");
    

  const startWSrequest = () => {
    var request_type = "EXTAPI:";
    var request = request_type.concat(deviceID);
    
    websocket.addEventListener('open', function (event) {
      websocket.send(request);
    });
    
    websocket.addEventListener('message', function (e) {
      
      const response = e.data // JSON.stringify(e.data)

      if (response.Completed) {
        onApproved(e.data)
      }
    });
    
  };

  useEffect(() => {
    startWSrequest()
    
    
    const timeout = timeoutMsec + Date.now()
    const checkInterval = setInterval(async () => {
      try {
        
        if (Date.now() > timeout) {
          clearInterval(checkInterval)
          setTimeout(true)
          return
        } 
      }
      catch (exc) {
        console.log(exc)
      }
    }, 1000)
    
    return () => {
      websocket.close()
      clearInterval(checkInterval)
    }
  }, [])

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