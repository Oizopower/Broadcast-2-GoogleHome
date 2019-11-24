# Broadcast-2-GoogleHome
Broadcast from $_GET to Google Home Mini  
  
sudo apt-get install nodejs npm  
cd ~ && git clone https://github.com/Oizopower/Broadcast-2-GoogleHome && cd Broadcast-2-GoogleHome  
npm install  
  
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
sudo systemctl start Broadcast-2-GoogleHome  
