#!/usr/bin/env node
var Pidentifier = require('../lib/pidentifier.js');
var jsonFile = require('jsonfile');
var readlineSync = require('readline-sync');
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
    new Pidentifier(config).identify();
  }
}

function readConfig () {
  try {
    config = jsonFile.readFileSync(configFile);
  } catch (err) {
    // File not there yet - continue with the empty config above
    console.log("Couldn't read JSON file: " + configFile);
  }
  return config;
}

function configure() {
  // Read Configuration
  config = readConfig() || {};

  config.firebaseDb = readlineSync.question("Please enter your Firebase db name: ");
  config.piName = readlineSync.question("Please enter a name for this Pi: ");

  jsonFile.writeFileSync(configFile, config);
  console.log("Done saving config data for pi-ip");
}