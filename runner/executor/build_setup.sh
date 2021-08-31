#!/usr/bin/env bash

echo 'Setting up build process'
# This is to prevent following error
# COPY failed: forbidden path outside the build context: ../../transpiler/ ()

# mkdir ./assets/
# rsync -av --progress ../../transpiler/ ./assets/transpiler --exclude node_modules

# go to you build path
src_dir=../../transpiler/
dst_dir=./assets/transpiler

mkdir -p $dst_dir
sudo mount --bind $src_dir $dst_dir
