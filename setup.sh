#!/bin/bash

#sudo apt-get update
#sudo apt-get dist-upgrade
#sudo apt full-upgrade
#reboot

curl -o https://raw.githubusercontent.com/creationix/nvm/v0.31.3/install.sh | bash

source ~/.nvm/nvm.sh

nvm install 4.2.1
nvm install node
nvm install 8.10.0

nvm use 8.10.0

sudo chmod -R 777 directory_name

npm install node-fetch@2

npm install log-timestamp

npm install @google-cloud/datastore

apt-get install ffmpeg
