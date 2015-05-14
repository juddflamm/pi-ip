//
// Node Module to ease finding out
// the IP Address of your Raspberry Pi
//
// Setup:
// This module writes to a Firebase hosted database.
// - Update the variable myFirebaseName, below, with
// the name of your firebase database.
// - Also, give your Pi a name, and put it in the
// variable myPiName, below.
//
// Written by Judd Flamm
// Github Repo: https://github.com/kd7yva/pi-ip
//

var jsonFile = require('jsonfile');
var os = require("os");
var Firebase = require("firebase");
var readlineSync = require('readline-sync');

var fileName = process.env.HOME + '/.pi-ip.json';
var config = {"myFirebaseName": null, "myPiName": null};

function readConfig () {
  try {
    config = jsonFile.readFileSync(fileName);
  } catch (err) {
    // File not there yet - continue with the empty config above
    console.log("Couldn't read JSON file: " + fileName);
  }
  return config;
}

function saveToFirebase () {
  // Read Configuration
  config = readConfig();

  // Get IP Addresses
  console.log("Network Interfaces:");
  console.log(os.networkInterfaces());
  var interfaces = os.networkInterfaces();
  var ipAddressEth0 = (interfaces["eth0"]) ? interfaces["eth0"][0].address : "disconnected";
  var ipAddressWlan0 = (interfaces["wlan0"]) ? interfaces["wlan0"][0].address : "disconnected";
  console.log("IP eth0: " + ipAddressEth0 + "\nIP wlan0: " + ipAddressWlan0);

  // If config data, try to Save to Firebase
  if((ipAddressEth0 === 'disconnected' && ipAddressWlan0 === 'disconnected')) {
    console.log('No connection');
  } else if (config && config.myFirebaseName && config.myPiName) {

    // Setup Firebase reference
    var firebaseRef = new Firebase("https://" + config.myFirebaseName + ".firebaseio.com/Pi/" + config.myPiName + "/");

    // Save IP Addresses to Firebase
    firebaseRef.set({"eth0": ipAddressEth0, "wlan0": ipAddressWlan0, "utc": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}, function(err) {
      // Unless we exit; firebase will keep the app running forever
      process.exit();
    });
  } else {
    console.log("No configuration data...");
    console.log("please run 'pi-ip config'");
  }

}

function configure() {
  // Read Configuration
  config = readConfig();

  config.myFirebaseName = readlineSync.question("Please enter your Firebase db name: ");
  config.myPiName = readlineSync.question("Please enter a name for this Pi: ");

  jsonFile.writeFileSync(fileName, config);
  console.log("Done saving config data for pi-ip");
}

exports.saveToFirebase = saveToFirebase;
exports.configure = configure;
