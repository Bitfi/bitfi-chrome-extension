import React, { useState } from 'react'
import { connect } from 'react-redux';
import { initAction, resetAction } from '../../redux/actions'
import Authed from './Authed';
import Unauthed from './Unauthed';
import Create from './Create'
import './styles/App.css'
import Header from '../components/Header';
import MessageBroker from '../../logic/api/message-broker'

function App({ encrypted, userDecrypted, init, reset }) {
  const [user, setUser] = useState(userDecrypted)

  const login = async ({ address, token }) => {
    const user = await MessageBroker.sendMessage.login({ address, token })
    setUser(user)
  }

  const logout = async () => {
    const user = await MessageBroker.sendMessage.logout()
    setUser(user)
  }

  const renderContent = () => {
    if (!encrypted)
      return <Create init={init}/>

    if (!user) 
      return <Unauthed encrypted={encrypted} login={login} reset={reset}/>

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

const mapStateToProps = state => state.auth

const mapDispatchToProps = dispatch => ({
  reset: () => dispatch(resetAction()),
  init: data => dispatch(initAction(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
