#!/bin/bash
set -euo pipefail

echo "Building Docker image"
DOCKER_HUB_USER=$1
DOCKER_HUB_PASSWORD=$2
TAG=$3
COMMIT=$4
NAME=$5

docker login -u "$DOCKER_HUB_USER" -p "$DOCKER_HUB_PASSWORD"

echo "Tagging release metadata"
sed -i -e "s/vers\": \\".*\\"/vers\": \"$COMMIT\"/" ./version.json
sed -i -e "s/release_name\": \\".*\\"/release_name\": \"$NAME\"/" ./version.json

docker build -t jmhansenas/atvise-frontend:"$TAG" .
docker push jmhansenas/atvise-frontend:"$TAG"
