# pi-ip

## What Is This?
pi-ip is a global node module for installing on your Raspberry Pi, so that when it starts up it will report it's IP address in a cloud hosted Firebase database of your choosing.

Additionally, this module supports being installed on multiple Raspberry Pi's, all with differently configured names.  All of the Pi IP addresses will be available in the same Firebase database.

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

### Setup to Run on Startup

1. Create an init.d run script `/etc/init.d/pi-ip.sh` with the following contents:

   ```
   #!/bin/bash
   su pi -c 'pi-ip'
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

### Alternate Configuration

If you have many Pi's that all need to be setup, it may be inconvenient to boot all of them, and run `pi-ip config` on each of them.

I have added an alternate way of configuring pi-ip for these scenarios.  Simply create a file called `pi-ip.json` in the boot partition and fill it with configure like so...
   ```
   {"firebaseDb":"noderockets","piName":"NodeRocket_0"}
   ```
The boot partition is the one file system you see if you put your Pi's SD Card into a Mac or Windows computer. Just place the file in the root folder of the SD Card file system.  If you are logged into the Pi via SSH, the boot partition can be found at `/boot/`.  Simply place the file there.

pi-ip will look for the config file in the usual place first, `/home/pi/.pi-ip.json`, then check `/boot/pi-ip.json`, in that order.  So if you run `pi-ip config`, which creates `/home/pi/.pi-ip.json`, the values in that file will always override anything in `/boot/pi-ip.json`.

## Future
Wireless Network Configuration stored in Firebase, and setup on the PI upon bootup using a wired connection.

