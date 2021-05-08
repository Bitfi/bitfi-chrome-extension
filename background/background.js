//import 'crx-hotreload'
import { getStore } from '../src/redux/store';
import MessageBroker from '../src/logic/api/message-broker';

(async () => {
  var user = null;
  MessageBroker.addListener.getUser((msg, sender, reply) => {
    reply(user);
    console.log(`GET USER ${JSON.stringify(user)}`);
  });
  

  console.log(MessageBroker.addListener.logout);

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

  const store = await getStore();

  store.subscribe(() => {
    console.log('change');
  });
})();


