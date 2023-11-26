#!/bin/bash
script_path=$(dirname "$(readlink -f "$0")")

echo "git reset --hard"
git reset --hard

echo "git pull"
git pull

echo "$script_path/run-compose.sh build"
$script_path/run-compose.sh build

echo "$script_path/run-compose.sh start"
$script_path/run-compose.sh start


