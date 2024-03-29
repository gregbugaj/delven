
FROM ubuntu:20.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
# SHELL ["/bin/bash", "--login", "-c", "-i"]

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v14.5.0
ENV NVM_VERSION v0.38.0

RUN mkdir -p /usr/local/nvm

# Install NVM
RUN curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh  | bash

# Install node and npm
RUN . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

RUN echo  '*** Node/NPM version check ***' \
		&& node --version \
		&& npm --version

## Application specific setup

RUN apt-get -y update
RUN apt-get install python3 -y

# set working directory
WORKDIR /usr/src/delven-server

# add app
COPY package.json /usr/src/delven-server
COPY package-lock.json /usr/src/delven-server
COPY tsconfig.json /usr/src/delven-server
COPY babel.config.js /usr/src/delven-server
COPY src /usr/src/delven-server/src
COPY entry.sh /usr/src/delven-server

RUN npm ci
RUN npm run build

# start app
ENTRYPOINT /usr/src/delven-server/entry.sh



