import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getStatus, getAccount } from './messaging/broker'
import { status } from './messaging/types'


function App() {
  const [account, setAccount] = useState('')

  const fetchAccount = async () => {
    const responseStatus = await getStatus()

    if (responseStatus === status.READY) {
      const account = await getAccount()
      console.log(account)
      setAccount(account)
    } else {
      setAccount(responseStatus)
    }
  }

  useEffect(async () => {
    fetchAccount()
  })

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {account}
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={fetchAccount} className="btn btn-primary">update</button>
      </header>
    </div>
  );
}

export default App;
