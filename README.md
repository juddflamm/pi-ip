# pi-ip

## What Is This?
pi-ip is a global node module for installing on your Raspberry Pi, so that when it starts up it will report it's IP address in a cloud hosted Firebase database of your choosing.

Additionally, this module supports being installed on multiple Raspberry Pi's, all with differently configured names.  All of the Pi IP addresses will be available in the same Firebase database.

## Prerequisites

1. A raspberry pi
2. NodeJS installed
   (some instructions: https://learn.adafruit.com/node-embedded-development/installing-node-dot-js)
3. A Firebase account, and database
   (get started: https://www.firebase.com/)

## Setup

### Install & Configure pi-ip

1. Login to your raspberry pi
2. Install pi-ip: `npm install -g pi-ip`
3. Configure pi-ip: `pi-ip config`
4. Test it out: `pi-ip`

   You should see something like the following
   ```
   { connected: true, interfaces: { eth0: '192.168.1.119' } }
   ```
   
### Setup Wifi settings in Firebase

Pi-ip also allows you to put your wifi ssid and password in Firebase, so that when you bootup on ethernet, pi-ip will configure your wifi automatically.  After the wifi is setup, pi-ip will update Firebase with the IP address of the wireless adapter.  To set this up, add the following JSON to your Firebase database:
   ```
   "pi-ip" : {
      "wifi" : {
         "ssid" : "REQUIRED SSID PROPERTY - your wifi network name",
         "secret-wpa" : "OPTIONAL PASSWORD PROPERTY - if using WPA or WPA2 security",
         "secret-wep" : "OPTIONAL PASSWORD PROPERTY - if using WEP security"
      }
   }
   ```
The `ssid` is required.  Though the `secret-wpa` and `secret-wep` are optional.
(pi-ip will not configure the wifi if the pi is already connected to wifi.)

### Setup to Run on Startup

1. Create an init.d run script `/etc/init.d/pi-ip.sh` with the following contents:

   ```
   #!/bin/bash

   case "$1" in
       start)
       su pi -c 'pi-ip'
       ;;
       stop)
       echo "Stop not supported"
       ;;
       restart)
       echo "Restart not supported"
       ;;
       status)
       echo "Status not supported"
       ;;
   esac
   
   exit 0
   ```

2. Make sure the pi-ip.sh script is executable: `sudo chmod ugoa+rx /etc/init.d/pi-ip.sh`
3. Set the script to run on startup: `sudo update-rc.d pi-ip.sh defaults`
4. Reboot your pi: `sudo reboot`
5. Watch your Firebase database for updates!  The database will have a node named `pi-ip`, with a node for each Pi within it.  The JSON would look something like this:

   ```
   {
     "pi-ip" : {
       "my-pi" : {
         "interfaces" : {
            "eth0" : "192.168.1.124",
            "wlan0" : "192.168.1.126"
         }
         "timestamp" : "2015-05-11 07:21:45"
       }
     }
   }
   ```

### Boot Partition Configuration

If you have many Pi's that all need to be setup, it may be inconvenient to boot all of them, and run `pi-ip config` on each of them.

I have added an alternate way of configuring pi-ip for these scenarios.  Simply create a file called `pi-ip.json` in the boot partition of the Pi's SD card and fill it with configuration like so...
   ```
   {"firebaseDb":"your-firebase-db-name-here","piName":"your-pi-name-here"}
   ```
(The boot partition is the one file system you see if you put your Pi's SD card into a Mac or Windows computer. If you are logged into the Pi via SSH, the boot partition can be found at `/boot/`.)

pi-ip will look for the config file in the usual place first, `/home/pi/.pi-ip.json`, and then check `/boot/pi-ip.json`.  So if you want the boot partition version to be used, delete any existing `/home/pi/.pi-ip.json` file.
