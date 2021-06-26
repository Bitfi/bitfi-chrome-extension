import { inject } from '../src/logic/messaging';
import background from '../src/logic/api/message-broker';

inject();
const { listen, subjects, status, dispatch } = window.bitfi;

listen(subjects.GET_STATUS, async (data, reply) => {
  const user = await ndMessage.getUser();
  reply(user ? status.READY : status.NOT_AUTHORIZED);
});

listen(subjects.GET_ACCOUNT, async (data, reply) => {
  const user = await background.sendMessage.getUser();
  reply(user ? user.address : null);
});

listen(subjects.SIGN_TX, async (data, reply) => {
  const response = await background.sendMessage.sendTx();
  reply(response);
});

/*
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.type === 'ACCOUNT_CHANGED') {
    console.log('CHANGED')
    dispatch(subjects.ACCOUNT_CHANGED, 'account changed')
  }
});
*/
