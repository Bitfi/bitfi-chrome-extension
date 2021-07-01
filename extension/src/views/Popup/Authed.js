import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { addPending } from '../../redux/actions'
import useBalance from '../../logic/hooks/use-balance';
import './styles/Authed.css'

export default function({ user,logout }) {
  const [copied, setCopied] = useState(false)
  const { balance } = useBalance(user.address)
  
  const dispatch = useDispatch()
  
  return (
    <div className="text-center w-100">
      <h1>
        <strong>{balance? format.btc(balance.btc, 3, 'XDC') : 'loading...'}</strong>
      </h1>
      
        <div>
          
          <CopyToClipboard text={user.address}
            onCopy={() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1000)
            }}>
              <div className=" d-flex justify-content-center align-items-center">
                <strong className="mr-2">{format.address(user.address)}</strong>
                <span className="hoverable material-icons " style={{ marginLeft: '7px', fontSize: '20px'}}>
                  {copied? 'check_circle' : 'content_copy'}
                </span>
              </div>
          </CopyToClipboard>
        </div>

        <div className="mt-4">
        </div>
        

      
      {
        /*
        <p>
          Token: <strong>{format.address(user.token, 7)}</strong>
        </p>
        */

      }
      {
        /*
        <p>
          Device ID: <strong>{user.deviceID.toUpperCase()}</strong>
        </p>
        */
      }

      <div className="d-flex">
      <button 
        className="w-100 button-primary" 
        onClick={() => window.open(`https://explorer.xinfin.network/addr/${user.address}`,'_blank')}
        style={{ marginLeft: '2px' }}
      >
        TX HISTORY
      </button>

      </div>
      <button 
        className="w-100 button-primary" 
        onClick={logout}
      >
        LOGOUT
      </button>
      {
        /*
        <button 
        className="w-100 button-primary" 
        onClick={() => dispatch(addPending(tx))}
      >
        SEND TX
      </button>
        */
      }
      
    </div>
  )
}