#!/bin/bash

scripts_dir="$(dirname "$0")"

source $scripts_dir/config.sh

# echo "--Pushing image $CONTAINER_NAME:$GIT_COMMIT to $PUBLIC_ECR_CONTAINER_NAME:latest"
# docker push $PUBLIC_ECR_CONTAINER_NAME:latest

echo "--Pushing image $CONTAINER_NAME:$GIT_COMMIT to $PRIVATE_ECR_CONTAINER_NAME:latest"
docker push $PRIVATE_ECR_CONTAINER_NAME:latest


