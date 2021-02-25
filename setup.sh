#!/usr/bin/env bash
echo "Starting setup"

MIN_VERSION='v14.5.0'
printf "Target NodeJS version : %s\n" $MIN_VERSION

if command -v nvm &> /dev/null
then
    nvm cache clear
    nvm install v14.5.0
    nvm use v14.5.0
fi

# Verfiy that the node is present
if ! command -v node &> /dev/null 
then
    echo "Node is not present"
    exit 1
fi

VERSION=$(node --version)
printf "Using version : %s\n" $VERSION