## XDC Chrome extension
It acts as a bridge between websites that support XDC currency and Bitfi hardware wallet.
Currently, it only allows to send/receive XDC. 
The extension can be installed using [this link](https://chrome.google.com/webstore/detail/bitfi-xdc-chrome-extensio/hollalkeimdfbjebppaojkookekggehm)

## API
You can check if the extension is installed by checking the `window.bitfi` variable in a context of your browser.
To check if a user is authenticated to the extension, invoke an async method `window.bitfi.getAccount` [example](https://github.com/just4hacking/Wallet/blob/33bb80434f361399fb15164adfa6d1b7e6660dff/src/wallets/hardware/bitfi/index.js#L38-L51).
It will return an address of the authenticated user as a string, otherwise `null` will be returned

To send a request for signing, please invoke an async method [example](https://github.com/just4hacking/Wallet/blob/33bb80434f361399fb15164adfa6d1b7e6660dff/src/wallets/hardware/bitfi/index.js#L78-L92)
```
window.bitfi.request(window.subjects.SIGN_TX, {
  gasLimit: string // amount of gasLimit in wei
  gasPrice: string // price of gas in wei
  nonce: string 
  to: string
  value: string // value being sent in wei
  chainId: string // network ID in decimal format
})
```

Along with `SIGN_TX` there are other request methods

```
GET_ACCOUNT - get current authenticated XDC account, returns null, if not authenticated
SIGN_TX - request for signing
EXPAND - starts up the extension in a separate browser tab
```

## Available Scripts

### `npm run watch`

It watches the files changes and updates the build.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
