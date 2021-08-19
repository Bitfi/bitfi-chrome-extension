export const promisify = f => new Promise((res, rej) => {
  f(_ => {
    var err = chrome.runtime.lastError
    if (err) 
      rej(err)
    else 
      res(_)
  })
})