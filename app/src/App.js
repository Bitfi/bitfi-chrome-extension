import { useState, useEffect } from 'react';
import useBitfi from './hooks/useBitfi'
import './App.css';
import useAccount from './hooks/useAccount';

function App() {
  const bitfi = useBitfi()
  let account = useAccount()
  
  const onSign = async () => {
    if (bitfi) {
      const res = await bitfi.request(bitfi.subjects.SIGN_TX)
      console.log(res)
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
        <button onClick={onSign}>sign</button>
      </header>
    </div>
  );
}

export default App;
