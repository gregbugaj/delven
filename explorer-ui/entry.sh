#!/bin/bash

echo "########## Delven WebUI - HTTP Server started ##########"
python3 -m http.server 3000 --directory build/
