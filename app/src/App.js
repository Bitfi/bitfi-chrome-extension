import { useState, useEffect } from 'react';
import useBitfi from './hooks/useBitfi'
import useAccount from './hooks/useAccount';
import './App.css';
import satoshi from './utils/satoshi';

function toSatoshi(v) {
  return bigInt(v).multiply(bigInt(10).pow(18))
}

function App() {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('0.1')
  const [to, setTo] = useState('xdc7381b15Ac37BC897cd2d4dF2C15F94FD4d8ae160')
  const [gasPrice, setGasPrice] = useState('1')

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
            amount: satoshi.to(amount, 18).toString(), 
            to,
            //gwei to sat
            gasPrice: satoshi.to(gasPrice, 10).toString()
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
              Please, login to your bitfi extension
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
              value={gasPrice} 
              onChange={e => {
                setGasPrice(e.target.value)
              }} 
            />
          </div>

        }
        
        {bitfi && account && <button disabled={loading} className="btn btn-primary" onClick={onSign}>Sign request</button>}
      </header>
    </div>
  );
}

export default App;
