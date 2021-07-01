import React, { useState, useEffect } from 'react'
import { request as requestBitfi } from '../../logic/api/bitfi-server'

export default function({ 
  className, frequencyMsec, deviceID, 
  onBack, onApproved, timeoutMsec 
}) {
  const [timeout, setTimeout] = useState(false)
  const [secsLeft, setSecsLeft] = useState(timeoutMsec)
  const [needCreateAccout, setNeedCreateAccount] = useState(false)
  const [displayToken, setDisplayToken] = useState(null)
  let websocket = new WebSocket("wss://bitfi.com/NoxWSHandler/NoxWS.ashx");
    

  const startWSrequest = () => {
    var request_type = "EXTAPI:";
    var request = request_type.concat(deviceID);
    
    websocket.addEventListener('open', function (event) {
      websocket.send(request);
    });
    
    websocket.addEventListener('message', async function (e) {
      
      const response = JSON.parse(e.data)
      console.log(response)
      if (response.DisplayToken) {
        setDisplayToken(response.DisplayToken)
      }
      
      //response.ExchangeToken = "fmwjEZG6zr3jwzR29E6UDYpixCwAT7Uatep7MDqZvmEQG/xo8lab0X0ru2ApNVkZvSHK4hMRIyWgGBQmVTT9qb8OcD7JLB7CpevIIGKSfY8DtPIAh+fBZMZRSeCACBpV49KlrHt9AHQ2TNskkt/+cXRR7d+uea2SPCalAC3IWYM0jA4xw3MC6rgy177Ty6EI+7s3pjOFuxGSmApMuvsfSA=="
      //response.Completed = true

      if (response.Completed) {
        const token = response.ExchangeToken 
        const accounts = await requestBitfi(token, 'GetAddresses')
        
        if (accounts[0]) {

          onApproved({
            address: accounts[0],
            token
          })
          
        }
        else {
          setNeedCreateAccount(true)
          return 
        }

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

  if (needCreateAccout) {
    return (
      <div className={`${className}`}>
        <h4 className="mb-0">
          Account is not created
        </h4>

        <button className="button-primary">
          CREATE
        </button>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <h4 className="mb-0">
        Waiting for approval...
      </h4>
      <p>
        please, don't close your extension...
      </p>

      {
        displayToken &&
        <h3>
          Display token:
          <br/>
          {displayToken}
        </h3>
      }
      
      <p>
        DEVICE ID: {deviceID}
      </p>
      <div>
        <a href="#" onClick={onBack}>enter different device ID</a>
      </div>
    </div>
  )
}