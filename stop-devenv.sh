#!/usr/bin/env bash

## https://unix.stackexchange.com/questions/568847/tmux-kill-window-doesnt-kill-child-processes

session='devenv'
# send Ctrl+C to each window pane before killin the session
#tmux list-panes -F "#{pane_pid}" | xargs -I {} tmux send-keys -t {} C-c &
#sleep 1
# force kill
tmux list-panes -F "#{pane_pid}" | xargs ps -o tpgid= | xargs -I{} kill -s SIGINT -{} &
sleep 1
tmux kill-session -t devenv
