#!/bin/bash
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f ./docker-compose.yml up --build
