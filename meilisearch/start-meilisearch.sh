#!/usr/bin/env bash
# Get the script's directory
script_path=$(dirname "$(readlink -f "$0")")

echo "Script dir is $script_path"

# Define the path to the .env files directory
env_files_dir="."

# Determine the environment based on NODE_ENV
case "$NODE_ENV" in
  "development")
    env_file=".env.local"
    ;;
  "production")
    env_file=".env.production"
    ;;
  # Add more cases for other environments as needed
  *)
    echo "Unknown or missing NODE_ENV. Defaulting to .env.local"
    env_file=".env.local"
    ;;
esac

# Load the chosen .env file
if [ -f "$env_files_dir/$env_file" ]; then
  source "$env_files_dir/$env_file"
  echo "Loaded $env_file for NODE_ENV: $NODE_ENV"
else
  echo "$env_file does not exist."
fi

output=$(docker container ls|grep meili)
if [ -n "$output" ]; then
  echo "Stopping meili container..."
  docker stop meili 2>&1
  sleep 5
  # You can further process the output here
else
  echo "meili not running"
fi
docker container rm meili 2>&1

docker run -it\
  --name meili \
  --rm \
  -p 7700:7700 \
  -v "$script_path/.meilidata:/meili_data" \
  getmeili/meilisearch:v1.4.2\
  meilisearch --master-key="$MEILI_MASTER_KEY"
