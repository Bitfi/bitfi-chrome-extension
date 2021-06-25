import React from 'react'
import { useDispatch } from 'react-redux'
import format from '../../logic/utils/format'
import { addPending } from '../../redux/actions'

const tx = {
  from: '0xF541C3CD1D2df407fB9Bb52b3489Fc2aaeEDd97E',
  to: '0x7beE0c6d5132e39622bDB6C0fc9F16b350f09453',
  amount: '1.23'
}

export default function({ user,logout }) {
  const dispatch = useDispatch()
  
  return (
    <div className="text-center w-100">
      <h3>Authed</h3>
      <p>
        Address: <strong>{format.address(user.address)}</strong>
      </p>
      <p>
        Token: <strong>{user.token}</strong>
      </p>

      <p>
        Device ID: <strong>{user.deviceID}</strong>
      </p>

      <button 
        className="w-100 button-primary" 
        onClick={logout}
      >
        LOGOUT
      </button>

      <button 
        className="w-100 button-primary" 
        onClick={() => dispatch(addPending(tx))}
      >
        SEND TX
      </button>
    </div>
  )
}