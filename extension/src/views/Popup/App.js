import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { initAction, resetAction } from '../../redux/actions'
import Authed from './Authed';
import Unauthed from './Unauthed';
import Create from './Create'
import './styles/App.css'
import Header from '../components/Header';
import MessageBroker from '../../logic/api/message-broker'
import Pending from './Pending';

function App({ userDecrypted }) {
  const { encrypted } = useSelector(state => state.auth)
  const { pending, pendingEmpty } = useSelector(state => state.request)

  const dispatch = useDispatch()
  const reset = () => dispatch(resetAction())
  const init = data => dispatch(initAction(data))

  const [user, setUser] = useState(userDecrypted)

  const login = async ({ address, token, deviceID }) => {
    const user = await MessageBroker.sendMessage.login({ address, token, deviceID })
    setUser(user)
  }

  const logout = async () => {
    const user = await MessageBroker.sendMessage.logout()
    setUser(user)
  }

  
  const renderPending = (user) => {
    const pendingItem = pending[0]
    const { from, to, amount } = pendingItem
    
    return (
      <Pending
        user={user}
        from={from}
        to={to}
        amount={amount}
      />
    )
  }

  const renderContent = () => {
    if (!encrypted)
      return <Create init={init}/>

    if (!user) 
      return <Unauthed encrypted={encrypted} login={login} reset={reset}/>
    
    if (!pendingEmpty)
      return renderPending(user)

    return <Authed logout={logout} user={user}/>
  }

  return (
    <div className="App">
      <Header/>
      <div className="w-100 h-100 d-flex align-items-center justify-content-center px-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default App
