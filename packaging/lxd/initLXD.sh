#!/bin/bash

lxd init --auto
lxc network delete lxdbr0
lxc network create lxdbr0 ipv6.address=none ipv4.address=10.0.4.1/24 ipv4.nat=true
