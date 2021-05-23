
function randomHex(len) {
  const hex = '0123456789ABCDEF';
  let output = '';
  for (let i = 0; i < len; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

const DEFAULT_OPTIONS =  { data: {}, timeoutMsec: 2000 }
export function request(subject, options = DEFAULT_OPTIONS) {
  const requestId = randomHex(6)
  const dataToSend = {
    request: { ...options.data },
    requestId,
    subject
  }

  return new Promise((res, rej) => {
    const timeout = setTimeout(() => {
      rej('Timeout')
    }, options.timeoutMsec)

    window.addEventListener("message", function (e) {
      
      if (e.source !== window)
        return;

      if (e.data.subject === subject && e.data.requestId === requestId && e.data.response) {
        clearTimeout(timeout)
        res(e.data)         
      }
    })
    
    window.postMessage(dataToSend, "*");
  })
}

export function listen(subject, respondWith = (req) => {}) {
  window.addEventListener("message", async function(event) {
    // We only accept messages from ourselves
    if (event.source !== window)
      return;
    
    if (event.data.subject === subject && !event.data.response) {
      const response = await respondWith(event.data.request)
      event.source.postMessage({
        subject,
        requestId: event.data.requestId,
        response
      }, "*")
    }
  })  
}

