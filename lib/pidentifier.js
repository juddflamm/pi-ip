var Interfaces = require('./interfaces');
var https = require("https");
var Promise = require("bluebird");

function Pidentifier(config) {
  var interfaces = new Interfaces();

  if(!config.firebaseDb || !config.piName) {
    console.log('Missing config');
    return;
  }

  function emit(data) {
    return new Promise(function (resolve, reject) {
      var req = https.request({
        hostname: config.firebaseDb + ".firebaseio.com",
        method: "PUT",
        path: "/pi/" + config.piName + ".json"
      }, function(res){
        resolve();
      });
      req.end(JSON.stringify(data));
    });
  }

  function identify() {
    return new Promise(function (resolve, reject) {
      interfaces.discover().then(function(results){
        if(results.connected) {
          emit({
            timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
            interfaces: results.interfaces
          }).then(function(){
            resolve(results);
          });
        } else {
          console.log('Unable to connect to internet', results);
          resolve(results);
        }
      });
    });
  }

  return {
    identify: identify
  }
}

module.exports = Pidentifier;
