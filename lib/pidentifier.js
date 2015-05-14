var Interfaces = require('./interfaces');
var https = require("https");

function Pidentifier(config) {
  var interfaces = new Interfaces();

  if(!config.firebaseDb || !config.piName) {
    console.log('Missing config');
    return;
  }

  function emit(data) {
    var req = https.request({
      hostname: config.firebaseDb + ".firebaseio.com",
      method: "POST",
      path: "/" + config.piName + ".json"
    });
    req.end(JSON.stringify(data));
  }

  function identify() {
    interfaces.discover(function(results) {
      if(results.connected) {
        emit({
          timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
          interfaces: results.interfaces
        })
      } else {
        console.log('Unable to connect to internet', results);
      }
    });
  }

  return {
    identify: identify
  }
}

new Pidentifier({firebaseDb: 'noderockets', piName: 'Gabriel'}).identify();

module.exports = Pidentifier;