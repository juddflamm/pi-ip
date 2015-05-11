# pi-ip

## What Is This?
pi-ip is a global node module for installing on your Raspberry Pi, so that when it starts up it will report it's IP address in a cloud hosted Firebase database of your choosing.

Additionally, this module supports being installed on multiple Raspberry Pi's, all with differently configured names.  All of the Pi IP addresses will be available in the same Firebase database.

## Setup

### Install & Configure pi-ip

1. Login to your raspberry pi
2. Install pi-ip: `npm install -g pi-ip`
3. Configure pi-ip `pi-ip config`
4. Test it out: `pi-ip`

You should see something like the following
```
Network Interfaces:
{ lo: 
   [ { address: '127.0.0.1',
       netmask: '255.0.0.0',
       family: 'IPv4',
       mac: '00:00:00:00:00:00',
       internal: true } ],
  eth0: 
   [ { address: '192.168.1.124',
       netmask: '255.255.255.0',
       family: 'IPv4',
       mac: 'b8:27:eb:2f:a2:19',
       internal: false } ] }
IP eth0: 192.168.1.124
IP wlan0: disconnected
```

### Setup to Run on Startup

1. Create the init.d run script `/etc/init.d/pi-ip.sh` with the following contents:

   ```
   #!/bin/bash
   pi-ip
   ```

2. Set the script to run on startup: `sudo update-rc.d pi-ip.sh defaults`
3. Reboot your pi: `sudo reboot`

## Future
Wireless Network Configuration stored in Firebase, and setup on the PI upon bootup using a wired connection, then auto reboot.

