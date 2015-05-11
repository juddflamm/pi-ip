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

function piIp () {
  var os = require("os");
  var Firebase = require("firebase");

  // Configuration
  var myFirebaseName = "name-of-your-firebase-db"; // the name of your firebase db
  var myPiName = "name-of-your-pi"; // give your Pi a name

  // Get IP Addresses
  console.log("Network Interfaces:");
  console.log(os.networkInterfaces());
  var interfaces = os.networkInterfaces();
  var ipAddressEth0 = (interfaces["eth0"]) ? interfaces["eth0"][0].address : "disconnected";
  var ipAddressWlan0 = (interfaces["wlan0"]) ? interfaces["wlan0"][0].address : "disconnected";
  console.log("IP eth0: " + ipAddressEth0 + "\nIP wlan0: " + ipAddressWlan0);

  // Setup Firebase reference
  var firebaseRef = new Firebase("https://" + myFirebaseName + ".firebaseio.com/Pi/" + myPiName + "/");

  // Save IP Addresses to Firebase
  firebaseRef.set({"eth0": ipAddressEth0, "wlan0": ipAddressWlan0, "utc": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}, function(err) {
    // Unless we exit; firebase will keep the app running forever
    process.exit();
  });

}

exports = piIp;
