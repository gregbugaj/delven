#!/bin/bash

# variables
CONTAINER=delven
IMAGE=ubuntu:20.04
PORT=8080
PROFILES=default
FOLDER=app
REPO=https://github.com/CalebEverett/hello-lxd.git
RUN_USER=app
RUN_USER_UID=1444
CONTAINER_ROOT_UID=$(cat /etc/subgid | grep lxd | cut -d : -f 2)

function wait_bar () {
  for i in {1..10}
  do
    printf '= %.0s' {1..$i}
    sleep $1s
  done
}

# create the container if it doesn't exist
if [ ! -e /var/lib/lxd/containers/$CONTAINER ]
  then
    lxc launch --verbose $IMAGE $CONTAINER
    wait_bar 0.5
    echo container $CONTAINER started
  else
    echo container $CONTAINER already created
fi
