import { useState, useEffect } from 'react';
import useBitfi from './hooks/useBitfi'
import './App.css';
import useAccount from './hooks/useAccount';

function App() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(null)
  const [to, setTo] = useState(null)
  const [fee, setFee] = useState(null)

  const bitfi = useBitfi()
  let account = useAccount()
  
  const onSign = async () => {
    if (bitfi) {
      setLoading(true)
      const res = await bitfi.request(
        bitfi.subjects.SIGN_TX, 
        { 
          timeoutMsec: 60 * 1000,
          data: {
            amount, 
            to,
            fee
          }
        }
      )
      console.log(res)
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          account?
            <div>
              {`${account.slice(0, 8)}...${account.slice(account.length - 8)}` || 'not_initialized'}
            </div> :
            <div>
              Waiting for bitfi wallet
            </div>
        }
        

        {
          bitfi && account &&
          <div className="form-group">
            <input 
              className="form-control mb-2" 
              placeholder="to"
              value={to} 
              onChange={e => {
                console.log(e)
                setTo(e.target.value)
              }} 
            />
            <input 
              className="form-control mb-2" 
              placeholder="amount XDC" 
              value={amount} 
              onChange={e => 
                setAmount(e.target.value)
              } 
            />
            <input
              className="form-control mb-2"  
              placeholder="fee (Gwei)" 
              value={fee} 
              onChange={e => 
                setFee(e.target.value)
              } 
            />
          </div>

        }
        
        {bitfi && account && <button disabled={loading} className="btn btn-primary" onClick={onSign}>Sign request</button>}
      </header>
    </div>
  );
}

export default App;
