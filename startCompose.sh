#!/bin/bash

docker stop $(docker ps -aq) && docker rm $(docker ps -aq) && docker rmi $(docker images -aq)

docker rmi --force csgo-marketplace-server

docker container prune -f && docker image prune -af && docker network prune -f && docker volume prune -f

docker network create public_network

docker-compose build

docker-compose up
