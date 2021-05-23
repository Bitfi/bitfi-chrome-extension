//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import MessageBroker from '../src/logic/api/message-broker';

(async () => {
  var user = null;
  const store = await getStore();

  MessageBroker.addListener.getUser((msg, sender, reply) => {
    reply(user);
  });
  
  MessageBroker.addListener.login((msg, sender, reply) => {
    user = {
      address: msg.address,
      token: msg.token,
    };
    reply(user);
    console.log(`LOGIN ${JSON.stringify(user)}`);
  });

  MessageBroker.addListener.logout((msg, sender, reply) => {
    user = null;
    reply(user);
    console.log(`LOGOUT ${JSON.stringify(user)}`);
  });

  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message)
  });

  store.subscribe(() => {
    console.log('change');
  });
})();


