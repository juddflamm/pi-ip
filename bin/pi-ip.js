#!/usr/bin/env node
var Pidentifier = require('../lib/pidentifier.js');
var jsonFile = require('jsonfile');
var readlineSync = require('readline-sync');
var Promise = require("bluebird");
var https = require("https");
var child_process = require('child_process');

var configFile = process.env.HOME + '/.pi-ip.json';

// Get command name
var args = process.argv.splice(2);
var commandName = args[0];

if (commandName) {
  if (commandName == "config") {
    configure();
  } else {
    console.log("invalid pi-ip command: " + commandName);
  }
} else {
  var config = readConfig();
  if(!config) {
    console.log('No config found, try running `pi-ip config`')
  } else {
    run();
  }
}

function run() {
  new Pidentifier(config).identify()
  .then(function(result){
    // Log out results for visual display
    console.log(result);
    return result;
  })
  .then(function(result){
    if (!result.interfaces.wlan0) {
      console.log("No wifi connection, trying to configure...");
      getWifiConfig().then(function(wifiConfig){
        if (wifiConfig && wifiConfig.ssid) {
          child_process.execSync("wpa_cli add_network", {"encoding": "utf8"});
          child_process.execSync("wpa_cli set_network 0 ssid '\"" + wifiConfig.ssid + "\"'", {"encoding": "utf8"});
          if (wifiConfig['secret-wpa']) {
            child_process.execSync("wpa_cli set_network 0 psk '\"" + wifiConfig['secret-wpa'] + "\"'", {"encoding": "utf8"});
          } else if (wifiConfig['secret-wep']) {
            child_process.execSync("wpa_cli set_network 0 key_mgmt NONE", {"encoding": "utf8"});
            child_process.execSync("wpa_cli set_network 0 wep_key0 '\"" + wifiConfig['secret-wep'] + "\"'", {"encoding": "utf8"});
          }
          child_process.execSync("wpa_cli enable_network 0", {"encoding": "utf8"});
          console.log("Attempting to connect to wireless network: " + wifiConfig.ssid);
          setTimeout(function(){
            child_process.execSync("wpa_cli save_config", {"encoding": "utf8"});
            new Pidentifier(config).identify()
            .then(function(newResult){
              // Log out results for visual display
              console.log(newResult);
            });
          }, 20000);
        } else {
          console.log("No wifi config data in Firebase.");
        }
      });
    }
  });
}

function getWifiConfig() {
  return new Promise(function (resolve, reject) {
    var req = https.request({
      hostname: config.firebaseDb + ".firebaseio.com",
      method: "GET",
      path: "/pi-ip/wifi.json"
    }, function(res){
      if (res.statusCode != 200) {
        resolve(null);
      } else {
        var body = '';
        res.on('data', function(d) {
          body += d;
        });
        res.on('end', function() {
          var parsed = JSON.parse(body);
          resolve(parsed);
        });
      }
    });
    req.end();
  });
}

function readConfig () {
  try {
    // Try reading config from saved config file
    config = jsonFile.readFileSync(configFile);
  } catch (err) {
    // Try reading config from /boot/config.txt
    try {
      config = jsonFile.readFileSync('/boot/pi-ip.json');
    } catch(err2) {
      // fail through
    }
  }
  if (!config) {
    console.log("Couldn't read config data.  Try 'pi-ip config'");
  }
  return config;
}

function configure() {
  // Read Configuration
  config = {};

  config.firebaseDb = readlineSync.question("Please enter your Firebase db name: ");
  config.piName = readlineSync.question("Please enter a name for this Pi: ");

  jsonFile.writeFileSync(configFile, config);
  console.log("Done saving config data for pi-ip");
}
