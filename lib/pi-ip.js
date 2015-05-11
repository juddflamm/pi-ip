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

function saveToFirebase () {
  var jsonFile = require('jsonfile')
  var os = require("os");
  var Firebase = require("firebase");

  // Read Configuration
  var fileName = __dirname + '/config.json';
  var config = jsonFile.readFileSync(fileName);

  // Get IP Addresses
  console.log("Network Interfaces:");
  console.log(os.networkInterfaces());
  var interfaces = os.networkInterfaces();
  var ipAddressEth0 = (interfaces["eth0"]) ? interfaces["eth0"][0].address : "disconnected";
  var ipAddressWlan0 = (interfaces["wlan0"]) ? interfaces["wlan0"][0].address : "disconnected";
  console.log("IP eth0: " + ipAddressEth0 + "\nIP wlan0: " + ipAddressWlan0);

  // If config data, try to Save to Firebase
  if (config && config.myFirebaseName && config.myPiName) {
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

exports.saveToFirebase = saveToFirebase;
