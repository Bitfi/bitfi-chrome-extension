//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import background from '../src/logic/api/message-broker';
import { addPending } from '../src/redux/actions';
import { checkApprove } from '../src/logic/api/bitfi-server';
import satoshi from '../src/logic/utils/satoshi';
import { DUMP_PASSWORD } from '../src/config';
import aes from '../src/logic/utils/aes';


const signAproveInterval = () => {
  let error = false
  let result = false

  const start = (params, timeout = 10000) =>
    new Promise(res => {
      clearInterval(interval)
      const startTime = Date.now()
      const interval = setInterval(async() => {
        if (error) {
          clearInterval(interval)
          res(error)
          return
        }

        if (result) {
          clearInterval(interval)
          res(result)
          return 
        }

        /*
        if (startTime + timeout < Date.now()) {
          const result = await checkApprove(params)
          clearInterval(interval)
          res(result)
        }
        */
      }, 1000)
    })

  const stop = (err) => {
    error = err
  }

  const success = (res) => {
    result = res
  }

  return [start, stop, success]
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
  const store = await getStore();
  var user = null;
  /*
  if (store.getState().auth.encrypted) {
    const { token, deviceID } = aes.decrypt(store.getState().auth.encrypted, DUMP_PASSWORD)
    
    user = {
      token,
      deviceID
    }
  }
  */
  
  background.addListener.getUser((msg, sender) => {
    return user
  });
  
  background.addListener.login((msg, sender) => {
    console.log('ON LOGIN')
    
    user = {
      address: msg.address,
      token: msg.token,
      deviceID: msg.deviceID
    };
    return user
  });

  background.addListener.onExpand(() => {
    chrome.tabs.create({url: 'index.html', active: false});
  })

  background.addListener.logout((msg, sender) => {
    user = null;
    return user
  });

  let stopTxCompletedListener = null

  const removeHexPrefix = (addr) => {
    if (addr.length >= 2 && addr.slice(0, 2) === '0x')
      return addr.slice(2)
    return addr
  }

  const ensureXdcPrefix = (addr) => {
    const newAddr = removeHexPrefix(addr)
    if (newAddr.length < 3 || newAddr.slice(0, 3) !== 'xdc')
      return `xdc${newAddr}`
    return newAddr
  }

  background.addListener.sendTx(async (msg, sender) => {

    if (store.getState().auth.encrypted) {
      
      const [start, stop, success] = signAproveInterval()
      console.log(msg.request)
      const tx = {
        from: ensureXdcPrefix(msg.request.from),
        to: ensureXdcPrefix(msg.request.to),
        amount: {
          sat: msg.request.amount,
          btc: satoshi.from(msg.request.amount, 18)
        },
        gasPrice: {
          sat: msg.request.gasPrice,
          btc: satoshi.from(msg.request.gasPrice, 18)
        }
      }

      stopTxCompletedListener && stopTxCompletedListener()
      stopTxCompletedListener = background.addListener.txCompleted((msg, sender) => {
        const { error, data } = msg

        if (error) {
          stop(error)
          return error
        }

        success(data)
        return data
      })

      store.dispatch(addPending(tx))

      const res = await start()
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


