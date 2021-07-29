
export const inject = () => {
  function codeToInject() {
    function randomHex(len) {
      var hex = '0123456789ABCDEF';
      var output = '';
      for (var i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
      }
      return output;
    }

    var subjects = {
      ACCOUNT_CHANGED: 'ACCOUNT_CHANGED',
      GET_STATUS: 'GET_STATUS',
      GET_ACCOUNT: 'GET_ACCOUNT',
      SIGN_TX: 'SIGN_TX',
      EXPAND: 'EXPAND'
    }
    
    var status = {
      NOT_INSTALLED: 'NOT_INSTALLED',
      NOT_INITIALIZED: 'NOT_INITIALIZED',
      NOT_AUTHORIZED: 'NOT_AUTHORIZED',
      READY: 'READY'
    }

    var eventName = "message"

    var DEFAULT_OPTIONS =  { data: {}, timeoutMsec: 2000 }
    function request(subject, options = DEFAULT_OPTIONS) {
      var requestId = randomHex(6)
      var dataToSend = {
        request: Object.assign(DEFAULT_OPTIONS, options.data),
        requestId,
        subject
      }
    
      return new Promise(function(res, rej) {
        var timeout = setTimeout(function() {
          rej('Timeout')
        }, options.timeoutMsec)
    
        window.addEventListener(eventName, function (e) {
          
          if (e.source !== window)
            return;
          
          if (e.data.subject === subject && e.data.requestId === requestId && e.data.responded) {
            clearTimeout(timeout)
            res(e.data)         
          }
        })
        
        window.postMessage(dataToSend, "*");
      })
    }

    /*
    function dispatch(subject, mes) {
      var requestId = randomHex(6)
      window.postMessage({
        subject,
        requestId,
        request: mes
      }, "*")
    }
    */
    
    function listen(subject, callback) {
      window.addEventListener(eventName, function(event) {
        // We only accept messages from ourselves
        if (event.source !== window)
          return;
        
        if (event.data.subject === subject && !event.data.responded) {

          callback && callback(event.data, function(response) {
            event.source.postMessage({
              subject,
              requestId: event.data.requestId,
              response,
              responded: true
            }, "*")
          })        
        }
      })  
    }
    
    function getStatus() {
      return new Promise(function(res, rej) {
        var subject = subjects.GET_STATUS
        request(subject)
        .then(function (response) {
          res(response.response)
        })
        .catch(function (err) {
          rej(JSON.stringify(err))
        })
      })
    }
    
    function getAccount() {
      return new Promise(function(res, rej) {
        var subject = subject = subjects.GET_ACCOUNT
        request(subject)
        .then(function (response) {
          res(response.response)
        })
        .catch(function (err) {
          rej(JSON.stringify(err))
        })
      })
    }

    var networkID = 50

    // Do here whatever your script requires. For example:
    window.bitfi = {
      subjects,
      status,
      getAccount,
      getStatus,
      request,
      listen,
      networkID
      //dispatch
    };
  }

  function embed(fn) {
    var script = document.createElement("script");
    script.text = `(${fn.toString()})();`;;
    document.documentElement.appendChild(script);
    fn()
  }
  
  embed(codeToInject);
}


