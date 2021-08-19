import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import App from './views/Popup/App'
import { getStore } from './redux/store'
import background from './logic/api/message-broker'
/* global BigInt */

//console = chrome.extension.getBackgroundPage().console

(async () => {


  if (chrome?.extension?.getBackgroundPage()?.console) {
    console = chrome.extension.getBackgroundPage().console
  }

  const user = await background.sendMessage.getUser()
  //console.log(user)
  const store = await getStore()

  ReactDOM.render(
    <Provider store={store}>
      <App userDecrypted={user}/>
    </Provider>,
    document.getElementById('root')
  );
})();
