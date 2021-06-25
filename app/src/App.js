import { useState, useEffect } from 'react';
import useBitfi from './hooks/useBitfi'
import './App.css';
import useAccount from './hooks/useAccount';

function App() {
  const [loading, setLoading] = useState(false)
  const bitfi = useBitfi()
  let account = useAccount()
  
  const onSign = async () => {
    if (bitfi) {
      setLoading(true)
      const res = await bitfi.request(bitfi.subjects.SIGN_TX, { timeoutMsec: 60 * 1000 })
      console.log(res)
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {account || 'not_initialized'}
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {bitfi && account && <button disabled={loading} className="btn btn-primary" onClick={onSign}>Sign request</button>}
      </header>
    </div>
  );
}

export default App;
