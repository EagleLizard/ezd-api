#!/bin/bash

scripts_dir="$(dirname "$0")"

source $scripts_dir/config.sh

DOCKER_TAG="$CONTAINER_NAME:$GIT_COMMIT"
CONTAINER_TAGS=("latest" "$BUILD_TIMESTAMP.$GIT_COMMIT")

echo "$(pwd)"

echo "Building image: $CONTAINER_NAME:$GIT_COMMIT"
docker build -f "./Dockerfile" \
  --tag="$CONTAINER_NAME:$GIT_COMMIT" .

echo "Tagging container with: ${CONTAINER_TAGS[@]}"
for CONTAINER_TAG in ${CONTAINER_TAGS[@]}; do
  echo "$CONTAINER_NAME:$GIT_COMMIT $CONTAINER_NAME:$CONTAINER_TAG"
  docker tag "${CONTAINER_NAME}:${GIT_COMMIT}" "${CONTAINER_NAME}:${CONTAINER_TAG}"
done
