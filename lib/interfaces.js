var os = require("os");
var dns = require('dns');
var Promise = require("bluebird");

function NetworkInterfaces(config) {
  config = config || {};

  function readInterfaces() {
    return new Promise(function (resolve, reject) {
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

      resolve(interfacesWithIpAddress);
    });
  }

  function canReachInternet(host) {
    return new Promise(function (resolve, reject) {
      if(!host) {
        host = config.host || 'www.google.com';
      }
      dns.resolve(host, function(err) {
        resolve(!err);
      });
    });
  }

  function discover(){
    return new Promise(function (resolve, reject) {
      Promise.join(canReachInternet(), readInterfaces(), function(isConnected, readInterfaces) {
        var result = {
          connected: isConnected,
          interfaces: readInterfaces
        };
        resolve(result);
      });
    });
  }

  return {
    canReachInternet: canReachInternet,
    discover: discover
  }
}

module.exports = NetworkInterfaces;
