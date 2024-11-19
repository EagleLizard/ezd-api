#!/bin/bash

export DOCKER_USER_NAME=eaglelizard

export CONTAINER_NAME="$DOCKER_USER_NAME/ezd-api"
export GIT_COMMIT=$(git rev-parse HEAD)
export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

export BUILD_TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"

