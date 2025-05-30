#!/bin/bash
script_path=$(dirname "$(readlink -f "$0")")
export CURRENT_UID=$(id -u)
export CURRENT_GUID=$(id -g)
export USERNAME=$(whoami)
export USERNAME=$(whoami)
set +e
source "$script_path/check_rootless_mode.sh"
ROOTLESS=$?
echo "rootless: $ROOTLESS"

if [ $ROOTLESS -eq 0 ]; then
 # docker rootless maps these back to user UID/GUID
        echo "set CURRENT_UID/CURRENT_GUID to 0 for rootless compat"
        export CURRENT_UID=0
        export CURRENT_GUID=0
fi

if grep -sq 'docker\|lxc' /proc/1/cgroup; then
    echo "Cannot run inside a container"
    exit 1;
fi
YARN="cd /app;\
export YARN_CACHE_FOLDER="/tmp/yarn_cache"; \
export YARN_CACHE_FOLDER="/tmp/yarn_cache"; \
rm -rf ./.data/uploads/miniaturi/*;\
rm -rf node_modules;\
yarn install --prefer-offline;\
yarn browserslist;\
yarn build;
"
EXTRA_ARGS="-d"
export WEB_MEM_LIMIT="1G"
#JEMALLOC="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

# NOTE running without WS
if [ "$1" == "dev" ]; then
    echo "Running development command"
    export WEB_MEM_LIMIT="4G"
    export WEB_CMD='yarn browserslist; yarn run dev'
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
elif [ "$1" == "deploy" ]; then
    if [[ "$(hostname)" == "ionosbox-ubuntu" ]]; then
      echo "ABORT! YOU ARE RUNNING ON THE PRODUCTION SERVER"
      exit 1
    fi
    echo "Ready to deploy"
    rsync -vaz "$script_path/../.next/" "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/.next/"
    rsync -vaz "$script_path/../node_modules/" "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/node_modules/"
    ssh -t $USERNAME@ionosbox "cd /home/$USERNAME/www/blitz-e4; git reset --hard; git pull"
    ssh -t $USERNAME@ionosbox "/home/$USERNAME/www/blitz-e4/docker/run-compose.sh start"
    rsync -vaz "$script_path/../.next/" "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/.next/"
    rsync -vaz "$script_path/../node_modules/" "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/node_modules/"
    ssh -t $USERNAME@ionosbox "cd /home/$USERNAME/www/blitz-e4; git reset --hard; git pull"
    ssh -t $USERNAME@ionosbox "/home/$USERNAME/www/blitz-e4/docker/run-compose.sh start"
    exit 0
elif [ "$1" == "pull" ]; then
    if [[ "$(hostname)" == "ionosbox-ubuntu" ]]; then
      echo "ABORT! YOU ARE RUNNING ON THE PRODUCTION SERVER"
      exit 1
    fi
    echo "Ready to pull"
    DUMP_CMD="docker exec e4-pg pg_dump -d eradauti-4 -p 5442 -U postgres --clean --if-exists"
    echo "pg_dump..."
    ssh -t $USERNAME@ionosbox "$DUMP_CMD" >/tmp/e4-pg.sql
    ssh -t $USERNAME@ionosbox "$DUMP_CMD" >/tmp/e4-pg.sql
    echo " done"
    echo "import db..."
    docker exec -i e4-pg psql -d eradauti-4 -p 5442 -U postgres </tmp/e4-pg.sql
    curl http://localhost:3000/api/meili

    rsync -vaz "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/.data/uploads/" "$script_path/../.data/uploads/"
    rsync -vaz "$USERNAME@ionosbox:/home/$USERNAME/www/blitz-e4/.data/uploads/" "$script_path/../.data/uploads/"

    exit 0
else
    echo "Invalid argument. Usage: $0 [dev|start|stop|build|logs]"
    exit 1
fi

mkdir -p /tmp/e4-web-tmp
mkdir -p /tmp/e4-web-cache
# set +e
# docker build --build-arg CURRENT_GUID=$CURRENT_GUID CURRENT_UID=$CURRENT_UID -f ./Dockerfile.nodejs
docker-compose -f "$script_path/docker-compose.yml" down 2>&1
docker-compose -f "$script_path/docker-compose.yml" up --build $EXTRA_ARGS
