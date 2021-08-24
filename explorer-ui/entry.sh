#!/bin/bash

echo "########## Delven WebUI - HTTP Server started ##########"
python3 -m http.server 8088 --directory build/
