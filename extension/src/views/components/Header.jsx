import React from 'react'
import background from '../../logic/api/message-broker'
import './styles/Header.css'

export default function({ deviceID }) {
  return (
    <header className="p-3 Header-container">
      <div className="d-flex w-100 h-100 align-items-center justify-content-between">
        <img className="pl-2" src="logo.svg" height="45" />

        
        
        <div className="d-flex">
          
          {
            deviceID &&
              <div className="d-flex align-items-center" style={{ marginRight: '5px' }}>
                <small><strong>{deviceID.toUpperCase()}</strong></small>
              </div>
          }
          <span 
            onClick={() => background.sendMessage.onExpand()}  
            className="hoverable material-icons"
            style={{ fontSize: '22px' }}
          >
            open_in_full
          </span>
        </div>
      </div>

    </header>
  )
}

//