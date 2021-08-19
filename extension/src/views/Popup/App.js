import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { initAction, resetAction } from '../../redux/actions'
import Authed from './Authed';
import Unauthed from './Unauthed';
import Create from './Create'
import './styles/App.css'
import bitfi from '../../logic/api/bitfi-server'
import Header from '../components/Header';
import background from '../../logic/api/message-broker'
import Pending from './Pending';

function App({ userDecrypted }) {  
  const [ loading, setLoading ] = useState(false)
  const { encrypted } = useSelector(state => state.auth)
  const { pendingEmpty } = useSelector(state => state.request)
  const [expired, setExpired] = useState(false)
  const [info, setInfo] = useState(null)
  const [needCreateAccout, setNeedCreateAccount] = useState(false)

  const dispatch = useDispatch()
  const reset = () => dispatch(resetAction())
  const init = data => dispatch(initAction(data))

  const [user, setUser] = useState(userDecrypted)

  const login = async ({ token, deviceID }) => {
    const tokenValid = await bitfi.request(token, 'IsTokenValid')
    
    if (!tokenValid) {
      reset()
      setExpired(true)
      return 
    }

    const accounts = await bitfi.request(token, 'GetAddresses')

    if (!accounts[0]) { 
      setNeedCreateAccount(true)
      setInfo({
        token, deviceID
      })
      return 
    }
    
    const user = await background.sendMessage.login({ address: accounts[0], token, deviceID })
    setUser(user)
  }

  const create = async () => {
    setLoading(true)
    const response = await bitfi.request(info.token, 'AddAddress')
    //console.log(response)
    setLoading(false)
  }

  const logout = async () => {
    const user = await background.sendMessage.logout()
    setUser(user)
  }

  const renderPending = (user) => {

    return (
      <Pending
        user={user}
      />
    )
  }

  const renderContent = () => {


    if (needCreateAccout) {
      return (
        <div className={`text-center`}>
          <h4 className="mb-2">
            Account creation
          </h4>
          <p>
            Prior to creating your Xinfin (XDC) wallet, 
            please ensure that your device is running firmware DMA-4 or 
            higher (DMA-4 includes the deterministic algorithm for XDC). 
            To update your device to DMA-4 go to this page for 
            instructions: <a href="https://bitfi.com/dma4">https://bitfi.com/dma4</a>
          </p>
          <p>
            To initialize the XDC wallet, 
            please click Add Address which will send a request to 
            your device. The device will ask you to enter your salt and 
            secret phrase which will create your XDC wallet. Once you have 
            successfully entered your salt and phrase, please click on the NEXT button or restart the extension.
          </p>
  
          <button
            onClick={create} 
            className={`button-primary w-100 ${loading? 'disabled' : ''}`}
          >
            ADD ADDRESS
          </button>
          <button
            onClick={async () => {
              setLoading(true)
              await login({ token: info.token, deviceID: info.deviceID })
              setLoading(false)
            }} 
            className={`button-primary w-100 ${loading? 'disabled' : ''}`}
          >
            NEXT
          </button>
        </div>
      )
    }

    if (!encrypted)
      return (
        <div className="w-100 text-center">
          
          <Create init={init}/>
          { 
            expired &&
            <div className="alert alert-warning text-center mt-3" role="alert">
              Authentication token has expired, please, walk through the 
              initialization process again
            </div>
          }
        </div>
      )

    if (!user) {
      return (
        <div className="w-100">
          
          <Unauthed encrypted={encrypted} login={login} reset={reset}/>
        </div>
      )
    }
    
    if (!pendingEmpty)
      return renderPending(user)

    return <Authed logout={logout} user={user} reset={reset}/>
  }

  
  return (
    <div className="App h-100 d-flex align-items-center">
      <Header deviceID={user && user.deviceID}/>
      <div className="w-100 h-100 d-flex align-items-center justify-content-center px-4" >
        {renderContent()}
      </div>
    </div>
  );
}

export default App
