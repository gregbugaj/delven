#!/bin/bash

set -e
echo -e "\033[0;32mAdding theme...\033[0m"
git subtree add --prefix=themes/hugo-theme-learn https://github.com/matcornic/hugo-theme-learn.git master --squash
