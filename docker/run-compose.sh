#!/bin/bash
script_path=$(dirname "$(readlink -f "$0")")
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)

# NOTE running without WS
if [ "$1" == "dev" ]; then
    echo "Running development command"
    export WEB_CMD='yarn run dev:1-blitz'
elif [ "$1" == "start" ]; then
    echo "Running start command"
    export WEB_CMD='yarn build:1-blitz; yarn run start:1-blitz'
elif [ "$1" == "stop" ]; then
    echo "Running stop command"
    docker-compose -f "$script_path/docker-compose.yml" down 2>&1
    exit 0
elif [ "$1" == "logs" ]; then
    echo "Running logs command"
    docker-compose -f "$script_path/docker-compose.yml" logs -f
    exit 0
else
    echo "Invalid argument. Usage: $0 [dev|start|stop]"
    exit 1
fi

mkdir -p /tmp/e4-web-tmp
mkdir -p /tmp/e4-web-cache
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f "$script_path/docker-compose.yml" down --remove-orphans 2>&1
docker-compose -f "$script_path/docker-compose.yml" up --build -d
