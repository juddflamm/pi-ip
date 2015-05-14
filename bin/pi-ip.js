#!/usr/bin/env node
var piIp = require('../lib/pi-ip.js');

// Get command name
var args = process.argv.splice(2);
var commandName = args[0];

if (commandName) {
  if (commandName == "config") {
    piIp.configure();
  } else {
    console.log("invalid pi-ip command: " + commandName);
  }
} else {
  piIp.saveToFirebase();
}
