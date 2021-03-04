#!/usr/bin/env bash
printf '\e[1;32m%-6s\e[m\n' "Starting Explorer Environment"

# Verfiy that the node is present
if ! command -v tmux &> /dev/null 
then
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

# setup shared development using `npm link`
printf '\e[1;32m%-6s\e[m\n' "Linking shared libs"


cd ./transpiler 
npm link 

cd ..

cd ./runner/executors
npm link delven-transpiler # Package name

cd ../..
cd ./runner/executors && npm run dev

pane_cmd_1='echo "1"'
pane_cmd_2='echo "2"'
pane_cmd_3='echo "3"'
pane_cmd_4='echo "4"'
pane_cmd_5='echo "5"'
pane_cmd_6='echo "6"'

#pane_cmd_1="cd ./transpiler && npx babel --watch src --out-dir dist --extensions '.ts'  --source-maps inline"

# npm run watch-ts
# npm run dev

# pane_cmd_2='cd ./explorer-ui && npm run start'
# pane_cmd_3='cd ./explorer-server && npm run watch-ts'
# pane_cmd_4='cd ./explorer-server && npm run dev'


pane_cmd_1='cd ./explorer-ui && npm run start'
pane_cmd_2='cd ./runner/executors && npm run dev'

pane_cmd_3='cd ./explorer-server && npm run dev'

pane_cmd_4='cd ./runner/executors && npm run watch-ts'
pane_cmd_5='cd ./explorer-server && npm run watch-ts'
pane_cmd_6='echo'

# pane_cmd_1='echo "1"'
# pane_cmd_2='echo "2"'
# pane_cmd_3='echo "3"'
# pane_cmd_4='echo "4"'
# pane_cmd_5='echo "5"'
# pane_cmd_6='echo "6"'

session='devenv-explorer'
# start new detached tmux session
tmux new-session -d -s "$session";   

tmux split-pane -h
tmux select-pane -t ${session}:1.1
tmux split-pane -v 

tmux select-pane -t ${session}:1.3
tmux split-pane -v 

tmux select-pane -t ${session}:1.4
tmux split-pane -v 
tmux split-pane -v 

tmux select-pane -t ${session}:1.3
tmux resize-pane -D -t ${session}:1.3 10 # (Resizes the current pane down by 10 cells)

tmux send -t ${session}:1.1 "$pane_cmd_1" ENTER;                
tmux send -t ${session}:1.2 "$pane_cmd_2" ENTER;                 
tmux send -t ${session}:1.3 "$pane_cmd_3" ENTER;                 
tmux send -t ${session}:1.4 "$pane_cmd_4" ENTER;             
tmux send -t ${session}:1.5 "$pane_cmd_5" ENTER;                 
tmux send -t ${session}:1.6 "$pane_cmd_6" ENTER;        

# Focus and attach
tmux select-pane -t ${session}:1.1
tmux attach-session -t "$session"
 
# Usefull commands
# tmux list-panes -a
# tmux kill-session -t devenv-explorer

# Press : Ctrl+B, and then X  to Display Pane number

