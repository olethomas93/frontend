#!/bin/bash
# Pull container from dockerhub
DOCKER_HUB_USER=$1
DOCKER_HUB_PASSWORD=$2
TAG=$3
CONTAINER_NAME=$4
BACKEND_IP=$5
# Set var based on type of deploy
echo "Setting Port Number"
PORT=8654
RUN_STATE='production'
if [[ $TAG == "staging" ]]; then
    PORT=8655
    RUN_STATE='staging'
fi
if [[ $TAG == "staging-avju" ]]; then
    PORT=8655
    RUN_STATE='staging'
fi
if [[ $TAG == "test" ]]; then
    PORT=8656
    RUN_STATE='test'
fi
# Get the container from docker
echo "Pull docker container: $CONTAINER_NAME with tag $TAG from dockerhub"
docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD
docker pull jmhansenas/atvise-frontend:$TAG
# Stop if container exists
echo "Stop the running container $CONTAINER_NAME if there is one"
echo "docker rm -f $CONTAINER_NAME &>/dev/null && echo \"Removed old container $CONTAINER_NAME\""
docker rm -f $CONTAINER_NAME &>/dev/null && echo "Removed old container $CONTAINER_NAME"
# Restart the container
echo "Restart $CONTAINER_NAME with script"
echo "Restart docker run --restart=unless-stopped --name $CONTAINER_NAME --network jmhansen-services_backend -v /srv/vault/atvise-ux/$RUN_STATE/.env:/srv/node/app/.env -d -p $BACKEND_IP:$PORT:8654 jmhansenas/atvise-frontend:$TAG"
docker run --restart=unless-stopped --name $CONTAINER_NAME --network jmhansen-services_backend -v /srv/vault/atvise-ux/$RUN_STATE/.env:/srv/node/app/.env -d -p $BACKEND_IP:$PORT:8654 jmhansenas/atvise-frontend:$TAG