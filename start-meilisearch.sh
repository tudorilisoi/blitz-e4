#!/usr/bin/env bash

#!/bin/bash

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



docker stop meili 2>&1
sleep 5
docker run -it\
  --name meili \
  --rm \
  -p 7700:7700 \
  -v $(pwd)/.meilidata:/meili_data \
  getmeili/meilisearch:v1.4.1\
  meilisearch --master-key="$MEILI_MASTER_KEY"
