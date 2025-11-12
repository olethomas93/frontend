#!/bin/bash
set -euo pipefail

DOCKER_HUB_USER=$1
DOCKER_HUB_PASSWORD=$2
TAG=$3
CONTAINER_NAME=$4
BACKEND_IP=$5

PORT=3000
RUN_STATE='production'

case "$TAG" in
  staging)
    PORT=3001
    RUN_STATE='staging'
    ;;
  test)
    PORT=3002
    RUN_STATE='test'
    ;;
  staging-avju)
    PORT=3001
    RUN_STATE='staging'
    ;;
esac

docker login -u "$DOCKER_HUB_USER" -p "$DOCKER_HUB_PASSWORD"
docker pull jmhansenas/atvise-frontend:"$TAG"

docker rm -f "$CONTAINER_NAME" 2>/dev/null && echo "Removed old container $CONTAINER_NAME" || true

docker run \
  --restart=unless-stopped \
  --name "$CONTAINER_NAME" \
  --network jmhansen-services_backend \
  -v /srv/vault/atvise-ux/$RUN_STATE/.env:/app/.env \
  -d \
  -p "$BACKEND_IP:$PORT:3000" \
  jmhansenas/atvise-frontend:"$TAG"
