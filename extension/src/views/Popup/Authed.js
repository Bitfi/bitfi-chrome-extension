import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { addPending } from '../../redux/actions'
import useBalance from '../../logic/hooks/use-balance';

const tx = {
  from: '0xF541C3CD1D2df407fB9Bb52b3489Fc2aaeEDd97E',
  to: '0x7beE0c6d5132e39622bDB6C0fc9F16b350f09453',
  amount: '1.23'
}

export default function({ user,logout }) {
  const [copied, setCopied] = useState(false)
  const { balance } = useBalance(user.address)
  
  const dispatch = useDispatch()
  
  return (
    <div className="text-center w-100">
      <h3>Authed</h3>
      
      <p>
        Balance: <strong>{balance? format.btc(balance.btc, 3, 'XDC') : 'loading...'}</strong>
      </p>

      <p>
        Address: <strong>{format.address(user.address)}</strong>
        <CopyToClipboard text={user.address}
        onCopy={() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1000)
        }}>
        <a className="btn btn-link">{copied? 'copied' : 'copy'}</a>
      </CopyToClipboard>
      </p>

      <p>
        Token: <strong>{format.address(user.token, 7)}</strong>
      </p>

      <p>
        Device ID: <strong>{user.deviceID.toUpperCase()}</strong>
      </p>

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