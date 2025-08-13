#!/bin/bash

export DOCKER_USER_NAME=eaglelizard

export CONTAINER_NAME="$DOCKER_USER_NAME/ezd-api"
export PRIVATE_ECR_CONTAINER_NAME=297608881144.dkr.ecr.us-west-2.amazonaws.com/eaglelizard/ezd-api
export PUBLIC_ECR_CONTAINER_NAME=public.ecr.aws/e5j9q8e1/eaglelizard/ezd-api
export GIT_COMMIT=$(git rev-parse HEAD)
export GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

export BUILD_TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"

export JCD_WEB_CONTAINER_TAG=ezd-api-jcd-web
export JCD_WEB_CONTAINER_NAME=ezd_api_jcd_web