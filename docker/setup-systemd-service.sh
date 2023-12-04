#!/bin/bash
sudo apt-get install pass gnupg2

# create a gpg2 key
gpg2 --gen-key

# create the password store using the gpg user id
pass init $gpg_id



if [ $# -eq 0 ]; then
    echo  "Usage: $0 folderName [-u]"
    echo  "-u: uninstall"
    exit 1;
fi
# TODO make a copy and substitute workdir and $1

clear

BASE_DIR="/home/tudor/Documents/dev"
# production @ionos
# BASE_DIR="/home/tudor/www"

SRV_NAME=$1
SERVICE_FILE="docker-compose@$SRV_NAME.service"
# cp docker-compose@.service "$SERVICE_FILE"
WDIR="$BASE_DIR/$SRV_NAME/docker"

rm "/tmp/$SERVICE_FILE" 2>&1
sed "s#WDIR#$WDIR#g" docker-compose@.service > "/tmp/$SERVICE_FILE"

cat "/tmp/$SERVICE_FILE"

#debug
# exit

sudo cp "/tmp/$SERVICE_FILE" "/etc/systemd/system/$SERVICE_FILE"
rm "/tmp/$SERVICE_FILE"
sudo systemctl daemon-reload
sudo systemctl restart "$SERVICE_FILE"

journalctl -f -u "$SERVICE_FILE"
