#!/usr/bin/bash

apt-get update
apt-get upgrade
apt-get install nodejs
apt-get install libwebp
apt-get install ffmpeg
apt-get install wget
apt-get install tesseract
wget -O ~/../usr/share/tessdata/ind.traineddata "https://github.com/jefersonmp/botteste/blob/main/install.sh
npm install

echo "[*] All dependencies have been installed, please run the command \"npm start\" to immediately start the script"
