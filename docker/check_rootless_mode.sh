#!/bin/bash

# Function to check if Docker is running in rootless mode
check_docker_rootless() {
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        echo "Docker is not installed."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        echo "Docker is not running."
        exit 1
    fi

    # Check for rootless mode indicators
    if [ -n "$XDG_RUNTIME_DIR" ] && [ -S "$XDG_RUNTIME_DIR/docker.sock" ]; then
        echo "Docker is running in rootless mode."
        return 0
    fi

    if docker info 2>/dev/null | grep -q "rootless: true"; then
        echo "Docker is running in rootless mode."
        return 0
    fi

    if [ "$(docker info -f '{{ .SecurityOptions }}')" == "[name=rootless]" ]; then
        echo "Docker is running in rootless mode."
        return 0
    fi

    # Check the default socket path
    if [ ! -S "/var/run/docker.sock" ] && [ -S "$HOME/.docker/run/docker.sock" ]; then
        echo "Docker is running in rootless mode."
        return 0
    fi

    echo "Docker is NOT running in rootless mode."
    return 1
}

# Main execution
check_docker_rootless
