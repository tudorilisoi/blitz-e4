#!/bin/bash
sudo apt-get install pass gnupg2

# create a gpg2 key
gpg2 --gen-key

# create the password store using the gpg user id
pass init $gpg_id

# TODO make a copy and substitute workdir and $1

sudo cp docker-compose@.service /etc/systemd/system/docker-compose@pauls.ro.service
sudo systemctl daemon-reload
sudo systemctl restart docker-compose@pauls.ro

journalctl -f -u docker-compose@pauls.ro
