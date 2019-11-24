# Broadcast-2-GoogleHome
Broadcast from $_GET to Google Home Mini ideal for Domoticz HTTP custom notifications
  
# Installation

sudo apt-get install nodejs npm  
cd ~ && git clone https://github.com/Oizopower/Broadcast-2-GoogleHome && cd Broadcast-2-GoogleHome  
npm install  
edit config.json to your settings  

```
{
  "GoogleHomeIp": "192.168.1.56", // Google Home IP
  "GoogleHomelang": "nl", // Language
  "WebserverPort": 5555 // Port to listen on
}
```
  
sudo nano /lib/systemd/system/Broadcast-2-GoogleHome.service  
  
```
[Unit]
Description=Broadcast-2-GoogleHome
Documentation=https://github.com/Oizopower/Broadcast-2-GoogleHome
After=network.target

[Service]
Type=simple
User=pi
ExecStart=/usr/bin/node /home/pi/Broadcast-2-GoogleHome/app.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```  
  
sudo systemctl daemon-reload  
sudo systemctl enable Broadcast-2-GoogleHome  
sudo systemctl start Broadcast-2-GoogleHome  

# Domoticz
Go to Setup > Settings > Notifications  
enable Custom HTTP/Action  
Fill in URL/Action: http://localhost:5555/tts/#MESSAGE  
