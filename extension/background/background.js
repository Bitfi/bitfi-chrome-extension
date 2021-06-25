//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import MessageBroker from '../src/logic/api/message-broker';
import { addPending } from '../src/redux/actions';

function wait(timeout) {
  return new Promise((res, rej) => setTimeout(() => {
    res()
  }, timeout))
}


(async () => {
  async function getCurrentTab() {
    return new Promise((res, rej) => {
      let queryOptions = { active: true, currentWindow: true };
      chrome.tabs.query(queryOptions, tabs => {
        res(tabs[0])
      });
    })
    
  }

  var user = null;
  const store = await getStore();
  //const currentTab = getCurrentTab()
  //console.log(store)
  //console.log(currentTab)

  MessageBroker.addListener.getUser((msg, sender, reply) => {
    reply(user);
  });
  
  MessageBroker.addListener.login((msg, sender, reply) => {
    user = {
      address: msg.address,
      token: msg.token,
      deviceID: msg.deviceID
    };
    reply(user);
    
    // notify-content-script
    //console.log('MESSAGE SENT')
    //chrome.runtime.sendMessage({ type: 'ACCOUNT_CHANGED', account: user })
  });

  MessageBroker.addListener.logout((msg, sender, reply) => {
    user = null;
    reply(user);
    //chrome.runtime.sendMessage({ type: 'ACCOUNT_CHANGED', account: user })
  });

  MessageBroker.addListener.sendTx(async (msg, sender, reply) => {
    
    if (store.getState().auth.encrypted) {

      const tx = {
        from: '0xF541C3CD1D2df407fB9Bb52b3489Fc2aaeEDd97E',
        to: '0x7beE0c6d5132e39622bDB6C0fc9F16b350f09453',
        amount: '1.23'
      }

      store.dispatch(addPending(tx))
      
      //const tab = await getCurrentTab()
      //console.log(tab)
      //console.log(currentTab)
      //chrome.browserAction.openPopup() //.setPopup({ popup: 'index.html' })
      //chrome.tabs.create({url:"index.html"});
     
      //chrome.tabs.update(tab.id, {url: 'index.html'});
      reply(true)
    } else {
      //chrome.tabs.create({url:"index.html"})
      reply(false)
    }
  })

  if (store.getState().request.pending.length > 0) {
    chrome.browserAction.setBadgeText({ text: store.getState().request.pending.length.toString() })
  }

  store.subscribe(async () => {
    console.log('change');
    if (store.getState().request.pending.length > 0) {
      chrome.browserAction.setBadgeText({ text: store.getState().request.pending.length.toString() })
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
    }
    
  });
})();


