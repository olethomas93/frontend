#!/bin/bash
echo "Build docker container"
# Init tags
DOCKER_HUB_USER=$1
DOCKER_HUB_PASSWORD=$2
TAG=$3
COMMIT=$4
NAME=$5

# Login to docker
docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD
# Diffrent build based on location
echo "Docker build for atvise-ux"
# Tag latest and push
sed -i -e "s/ux-0.0.0.0/$COMMIT/g" ./version.json
sed -i -e "s/ux-name/$NAME/g" ./version.json
# Push to dockerhub
docker build -t jmhansenas/atvise-frontend:$TAG --build-arg user_id="1001" --build-arg group_id="1001" --build-arg prebuild=true . --no-cache
docker push jmhansenas/atvise-frontend:$TAG


