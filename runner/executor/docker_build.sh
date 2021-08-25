#!/usr/bin/env bash

echo 'Copying assets'
# This is to prevent following error
# COPY failed: forbidden path outside the build context: ../../transpiler/ ()
mkdir ./assets/
rsync -av --progress ../../transpiler/ ./assets/transpiler --exclude node_modules

docker build -t delven/runner:1.0 .