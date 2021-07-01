//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import background from '../src/logic/api/message-broker';
import { addPending } from '../src/redux/actions';
import { checkApprove } from '../src/logic/api/bitfi-server';
import satoshi from '../src/logic/utils/satoshi';


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
  
  var user = null;
  const store = await getStore();

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

  background.addListener.sendTx(async (msg, sender) => {

    if (store.getState().auth.encrypted) {
      
      const [start, stop, success] = signAproveInterval()
      
      const tx = {
        from: 'xdc7381b15Ac37BC897cd2d4dF2C15F94FD4d8ae160',
        to: msg.request.to,
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


