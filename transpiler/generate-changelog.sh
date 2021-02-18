#!/usr/bin/env bash
# Generates this kind of thing:
# https://github.com/joelittlejohn/jsonschema2pojo/blob/jsonschema2pojo-0.4.4/CHANGELOG.md
#
# If your issue has 'breaking' label, the issue will be shown in the changelog with bold text
# 
# All versions of this script are dedicated to the Public Domain, no rights reserved,
# as per https://creativecommons.org/publicdomain/zero/1.0/
#
if [ "$#" -ne 2 ]; then
    echo "Usage: ./generate-changelog.sh user/repo <github token>"
    exit 1
fi

IFS=$'\n'
echo "# Changelog" > CHANGELOG.md

for m in $(curl -s -H "Authorization: token $2" "https://api.github.com/repos/$1/milestones?state=closed&per_page=100" | jq -c '.[] | [.title, .number]' | sort -rV); do
    echo "Processing milestone: $m..."
    echo $m | sed 's/\["\(.*\)",.*\]/\n## \1/' >> CHANGELOG.md
    mid=$(echo $m | sed 's/.*,\(.*\)]/\1/')
    for i in $(curl -s -H "Authorization: token $2" "https://api.github.com/repos/$1/issues?milestone=$mid&state=closed" | jq -r '.[] | [.html_url, .number, .title, (.labels[] | select(.name == "breaking") | .name)] | @tsv'); do
	if [ "$(echo "$i" | cut -f 4)" = "breaking" ]; then
	    echo "* **$(echo "$i" | cut -f 3) ([#$(echo "$i" | cut -f 2)]($(echo "$i" | cut -f 1)))**"  >> CHANGELOG.md
	else
	    echo "* $(echo "$i" | cut -f 3) ([#$(echo "$i" | cut -f 2)]($(echo "$i" | cut -f 1)))"  >> CHANGELOG.md
	fi
    done
done