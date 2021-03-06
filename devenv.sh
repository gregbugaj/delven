#!/usr/bin/env bash

function log() {
    if [[ $# != 1 && $# != 3 ]]; then 
        printf '\e[1;91m%-6s\e[0m\n' "Invalid number of arguments, got $#  but expected 1 or 3"
        return
    fi

    label=""
    if [ "$#" == 1 ]; then        
        tag="INFO"
        msg="$1"
    else
        tag="$1"
        label="$2"
        msg="$3"
    fi

    trimmed=$(echo "$label" | cut -c1-14) #
    trimmed=$(printf "%-14s" "$trimmed")    # pad

    if [ "$tag" == "ERROR" ]; then
        printf '[\e[1;91m ERROR\e[0m ] [%-6s] %-6s\n' "$trimmed" "$msg"
    else
        printf '[\e[1;93m INFO \e[0m ] [%-6s] %-6s\n' "$trimmed" "$msg"
    fi 
}

function cleanup()
{
    log "Environment stopped"
}

trap cleanup EXIT

log "Starting Explorer Environment"
# Verfiy that the node is present
if ! command -v tmux &> /dev/null 
then
    log "ERROR" "Service Tag" "Message"
    printf '\e[1;31m%-6s\e[m\n' "Command 'tmux' not found, but can be installed with:"
    printf "\n"

    PS3='Please enter your choice: '
    options=("Install via 'apt'" "Install via 'snap'" "Quit")

    select opt in "${options[@]}"
    do
        case $opt in
            "Install via 'apt'")
                printf '\e[1;32m%-6s\e[m\n' "Installing via apt"
                sudo apt  install tmux 
                break
                ;;
            "Install via 'snap'")
                printf '\e[1;32m%-6s\e[m\n' "Installing via snap"
                sudo snap install tmux 
                break
                ;;
            "Quit")
                break
                ;;
            *) echo "invalid option $REPLY";;
        esac
    done

    printf '\e[1;32m%-6s\e[m\n' "Restart devenv"
    exit 1
fi

# Check if all ports are good to go before starting the application (# | xargs is uses to trim space)

expected_port_ui_dev=3000
expected_port_ui_server=8080
expected_port_ws_server=5000

# Can also use ss util from
# ss -l -p -n | grep 3000

port_ui_dev=$(netstat --all --listening --numeric --tcp | awk '{split($0, a,":"); print a[4]}' | grep $expected_port_ui_dev | xargs)
port_ui_server=$(netstat --all --listening --numeric --tcp | awk '{split($0, a,":"); print a[4]}' | grep $expected_port_ui_server | xargs)
port_ws_server=$(netstat --all --listening --numeric --tcp | awk '{split($0, a,":"); print a[4]}' | grep $expected_port_ws_server | xargs)

hasErrors=0 
if [ "$port_ui_dev" == "$expected_port_ui_dev" ]; then
    log "ERROR" "Explorer UI" "Port #$port_ui_dev already in use"
    hasErrors=1
fi

if [ "$port_ui_server" == "$expected_port_ui_server" ]; then
    log "ERROR" "Explorer Server" "Port #$port_ui_server already in use"
    hasErrors=1
fi

if [ "$port_ws_server" == "$expected_port_ws_server" ]; then
    log "ERROR" "Explorer Runner" "Port #$port_ws_server already in use"
    hasErrors=1
fi

if [ $hasErrors == 1 ]; then
    log "ERROR" "" "Preflight failed, Please fix all issues before continuing"
    exit 1
fi

# setup shared development using `npm link`
## This is somewhat hacky but because we are using TypeScript it is necessary
## 1) Precompile
## 2) Copy package.json : This has to happen as there is an issue with 
##    'npm link' backtracking a directory down and using that as the node_module package
##    and not the 'dist' folder
## 3) link dist directory
## 3) link destincation directory via 'npm link'


# log "Compiling / Linking shared libs"

# cd ./transpiler 
# npx babel src --out-dir dist --extensions '.ts,.js' --source-maps inline
# cd ./dist
# cp ../package.json .
# npm link 

# cd ../runner/executors
# npm link delven-transpiler

# cd ../..

pane_cmd_1='cd ./explorer-ui && npm run start'
pane_cmd_2='cd ./runner/executors && npm run dev'
pane_cmd_3='cd ./explorer-server && npm run dev'
pane_cmd_4='cd ./runner/executors && npm run watch-ts'
pane_cmd_5='cd ./explorer-server && npm run watch-ts'
pane_cmd_6="cd ./transpiler && npx babel --watch src --out-dir dist --extensions '.ts,.js' --source-maps inline"

# pane_cmd_1='echo 1'
# pane_cmd_2='echo 2'
# pane_cmd_3='echo 3'
# pane_cmd_4='echo 4'
# pane_cmd_5='echo 5'
# pane_cmd_6='echo 6'

session='devenv-explorer'
window=1 # Configured to start windows at 1 not 0

# start new detached tmux session
tmux -f devenv-tmux.conf new-session -d -s "$session" # -d "/usr/bin/env bash -i"
tmux rename-window 'Devenv'

# setup layout
tmux split-pane -h 
tmux select-pane -t ${session}:${window}.1
tmux split-pane -v 

tmux select-pane -t ${session}:${window}.3
tmux split-pane -v 

tmux select-pane -t ${session}:${window}.4
tmux split-pane -v 
tmux split-pane -v 

tmux select-pane -t ${session}:${window}.3
tmux resize-pane -D -t ${session}:${window}.3 10 # (Resizes the current pane down by 10 cells)

tmux send -t ${session}:${window}.1 "$pane_cmd_1" ENTER;                
tmux send -t ${session}:${window}.2 "$pane_cmd_2" ENTER;                 
tmux send -t ${session}:${window}.3 "$pane_cmd_3" ENTER;                 
tmux send -t ${session}:${window}.4 "$pane_cmd_4" ENTER;             
tmux send -t ${session}:${window}.5 "$pane_cmd_5" ENTER;                 
tmux send -t ${session}:${window}.6 "$pane_cmd_6" ENTER;        

# Focus and attach
tmux select-pane -t ${session}:${window}.1
tmux attach-session -t "$session"
 
# Usefull commands
# tmux list-panes -a
# tmux kill-session -t devenv-explorer

# Press : Ctrl+B, and then X  to Display Pane number

