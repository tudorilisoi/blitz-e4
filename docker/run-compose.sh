#!/bin/bash
script_path=$(dirname "$(readlink -f "$0")")
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)

if grep -sq 'docker\|lxc' /proc/1/cgroup; then
    echo "Cannot run inside a container"
    exit 1;
fi
YARN="cd /app; rm -rf ./.data/uploads/miniaturi/*; rm -rf node_modules; \
yarn add husky blitz --dev --force --frozen-lockfile; yarn install;\
yarn build:1-blitz;
"
EXTRA_ARGS="-d"
export WEB_MEM_LIMIT="1G"
#JEMALLOC="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

# NOTE running without WS
if [ "$1" == "dev" ]; then
    echo "Running development command"
    export WEB_MEM_LIMIT="4G"
    export WEB_CMD='yarn run dev:1-blitz'
elif [ "$1" == "start" ]; then
    echo "Running start command"
    export WEB_CMD="node /app/node_modules/.bin/blitz start"
elif [ "$1" == "stop" ]; then
    echo "Running stop command"
    docker-compose -f "$script_path/docker-compose.yml" down 2>&1
    exit 0
elif [ "$1" == "build" ]; then
    echo "Running build command"
     export WEB_MEM_LIMIT="4G"
    export WEB_CMD=$YARN
    EXTRA_ARGS="--abort-on-container-exit" # no detach
elif [ "$1" == "logs" ]; then
    echo "Running logs command"
    docker-compose -f "$script_path/docker-compose.yml" logs -f
    exit 0
else
    echo "Invalid argument. Usage: $0 [dev|start|stop|build|logs]"
    exit 1
fi

mkdir -p /tmp/e4-web-tmp
mkdir -p /tmp/e4-web-cache
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f "$script_path/docker-compose.yml" down --remove-orphans 2>&1
docker-compose -f "$script_path/docker-compose.yml" up --build $EXTRA_ARGS
