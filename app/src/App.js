import { useState, useEffect } from 'react';
import useBitfi from './hooks/useBitfi';
import useAccount from './hooks/useAccount';
import './App.css';
import satoshi from './utils/satoshi';

function toSatoshi(v) {
  return bigInt(v).multiply(bigInt(10).pow(18));
}

function App() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0.1');
  const [to, setTo] = useState('xdc7381b15Ac37BC897cd2d4dF2C15F94FD4d8ae160');
  const [gasPrice, setGasPrice] = useState('1');
  const [gasLimit, setGasLimit] = useState('30000');

  const bitfi = useBitfi();
  let account = useAccount();

  const onSign = async () => {
    if (bitfi) {
      setLoading(true);
      const res = await bitfi.request(bitfi.subjects.SIGN_TX, {
        timeoutMsec: 60 * 1000,
        data: {
          amount: satoshi.to(amount, 18).toString(),
          to,
          //gwei to sat
          gasPrice: satoshi.to(gasPrice, 10).toString(),
          gasLimit: gasLimit.toString(),
        },
      });
      console.log(res);
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (!bitfi) {
      return <div>Please install Bitfi chrome extension</div>;
    }

    if (!account) {
      return <div>Please, login to your bitfi extension</div>;
    }

    return (
      <h2>
        {`${account.slice(0, 8)}...${account.slice(account.length - 8)}` ||
          'not_initialized'}
      </h2>
    );
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {renderContent()}

        {bitfi && account && (
          <div>
            <div className='form-group'>
              <label htmlFor='to'>
                <small>To:</small>
              </label>
              <input
                id='to'
                className='form-control mb-2'
                placeholder='to'
                value={to}
                onChange={(e) => {
                  console.log(e);
                  setTo(e.target.value);
                }}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='amount'>
                <small>Amount:</small>
              </label>
              <input
                id='amount'
                className='form-control mb-2'
                placeholder='amount XDC'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='gasprice'>
                <small>Gas Price (Gwei):</small>
              </label>
              <input
                id='gasprice'
                className='form-control mb-2'
                placeholder='fee (Gwei)'
                value={gasPrice}
                onChange={(e) => {
                  setGasPrice(e.target.value);
                }}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='gaslimit'>
                <small>Gas Limit:</small>
              </label>
              <input
                id='gaslimit'
                type='number'
                min='0'
                step='1'
                className='form-control mb-2'
                placeholder='Gas Limit'
                value={gasLimit}
                onChange={(e) => {
                  setGasLimit(parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        )}

        {bitfi && account && (
          <button
            disabled={loading}
            className='mt-3 btn btn-primary w-100'
            onClick={onSign}
          >
            Send Sign Request
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
