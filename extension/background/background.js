//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import background from '../src/logic/api/message-broker';
import { addPending } from '../src/redux/actions';
import { checkApprove } from '../src/logic/api/bitfi-server';


const signAproveInterval = () => {
  let canceled  = false

  const start = (params, timeout = 10000) =>
    new Promise(res => {
      clearInterval(interval)
      const startTime = Date.now()
      const interval = setInterval(async() => {
        if (canceled) {
          console.log('REJECTED')
          clearInterval(interval)
          res('Rejected')
          return
        }

        if (startTime + timeout < Date.now()) {
          const result = await checkApprove(params)
          clearInterval(interval)
          res(result)
        }
      }, 1000)
    })

  const stop = () => {
    canceled = true
  }

  return [start, stop]
}



function wait(timeout) {
  return new Promise((res, rej) => setTimeout(() => {
    res()
  }, timeout))
}

async function getCurrentTab() {
  return new Promise((res, rej) => {
    let queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions, tabs => {
      res(tabs[0])
    });
  })
  
}

(async () => {
  

  var user = null;
  const store = await getStore();

  background.addListener.getUser((msg, sender) => {
    return user
  });
  
  background.addListener.login((msg, sender) => {
    user = {
      address: msg.address,
      token: msg.token,
      deviceID: msg.deviceID
    };
    return user
  });

  background.addListener.logout((msg, sender) => {
    user = null;
    return user
  });

  let cancelTxStopListen = null

  background.addListener.sendTx(async (msg, sender) => {
    if (store.getState().auth.encrypted) {
      
      const [start, stop] = signAproveInterval()
      const tx = {
        from: '0xF541C3CD1D2df407fB9Bb52b3489Fc2aaeEDd97E',
        to: '0x7beE0c6d5132e39622bDB6C0fc9F16b350f09453',
        amount: '1.23'
      }

      cancelTxStopListen && cancelTxStopListen()
      cancelTxStopListen = background.addListener.cancelTx(() => {
        console.log('TX CANCELED')
        stop()
      })

      store.dispatch(addPending(tx))

      const res = await start({ deviceID: 'aaaaaa' })
      return res
    }

    return true
  })

  if (store.getState().request.pending.length > 0) {
    chrome.browserAction.setBadgeText({ text: store.getState().request.pending.length.toString() })
  }

  store.subscribe(async () => {
    if (store.getState().request.pending.length > 0) {
      chrome.browserAction.setBadgeText({ text: store.getState().request.pending.length.toString() })
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
    }
    
  });
})();


