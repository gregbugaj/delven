#!/usr/bin/env bash

# Failfast on any errors
set -eu -o pipefail

function dependency_check(){
    MIN_VERSION='v14.5.0'
    printf "Target NodeJS version : %s\n" $MIN_VERSION
    if ! command -v nvm &> /dev/null
    then
      printf '\e[1;91m%-6s\e[0m \n' "nvm command not found or not available to the script"
      printf '\e[1;91m%-6s\e[0m \n' "Try executing as '. ./setup.sh'"
      exit 1
    fi

    if command -v nvm &> /dev/null
    then
        printf "Installing Node version : %s\n" $MIN_VERSION
        nvm cache clear
        nvm install v14.5.0
        nvm use v14.5.0
    fi

    # Verfiy that the node is present
    if ! command -v node &> /dev/null
    then
        printf "Node is not present"
        exit 1
    fi

    VERSION=$(node --version)
    printf "Using version : %s\n" $VERSION
}

# Silent pushd/popd
pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

function install_transpiller(){
    printf '\e[1;32m%-6s\e[m\n' "Installing : Transpiler"
    (
        cd  "./transpiler"
        npm install
    )
}

function install_runner(){
    printf '\e[1;32m%-6s\e[m\n' "Installing : Runner-Executor"
    (
        cd "./runner/executors"
        npm install
    )
}

function install_explorer_server(){
    printf '\e[1;32m%-6s\e[m\n' "Installing : Explorer Server"
    (
        cd "./explorer-server"
        npm install
    )
}

function install_explorer_ui(){
    printf '\e[1;32m%-6s\e[m\n' "Installing : Explorer UI"
    (
        cd "./explorer-ui"
        npm install
    )
}

printf '\e[1;32m%-6s\e[m\n' "Starting setup"
dependency_check
install_transpiller
install_runner
install_explorer_server
install_explorer_ui
