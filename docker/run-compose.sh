#!/bin/bash
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)
mkdir -p /tmp/e4-web-tmp
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f ./docker-compose.yml up --build
