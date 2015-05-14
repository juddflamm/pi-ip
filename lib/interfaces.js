var os = require("os");
var dns = require('dns');

function NetworkInterfaces(config) {
  config = config || {};

  function readInterfaces() {
    var allInterfaces = os.networkInterfaces();
    var interfacesWithIpAddress = {};

    for (var iface in allInterfaces) {
      if(allInterfaces.hasOwnProperty(iface)) {
        allInterfaces[iface].forEach(function(address) {
          if (address.family === 'IPv4' && !address.internal) {
            interfacesWithIpAddress[iface] = address.address;
          }
        })
      }
    }
    return interfacesWithIpAddress;
  }

  function canReachInternet(host, cb) {
    if(typeof host === 'function') {
      cb = host;
      host = config.host || 'www.google.com';
    }

    dns.resolve(host, function(err) {
      cb(err);
    });
  }

  function discover(cb){
    canReachInternet(function(err) {
      cb({
        connected: !err,
        interfaces: readInterfaces()
      })
    });
  }

  return {
    canReachInternet: canReachInternet,
    discover: discover
  }
}

module.exports = NetworkInterfaces;