[![CI-CD](https://github.com/gregbugaj/delven/actions/workflows/main.yml/badge.svg)](https://github.com/gregbugaj/delven/actions/workflows/main.yml)

# Delven

Delven is a Domain Specific Language (DSL) designed for mining content from static and dynamic sources, It closely resembles SQL with features borrowed from other popular languages. Delven is ECMAScript2020 compatible as it uses Source-To-Source transpiller so at the end of the day there are no special runtimes required.


Installation
----------------

`setup.sh` script can be used to perform initial installation
Passing the `--audit` flag will

```sh
. ./setup.sh
. ./setup.sh --audit
```

Individual project can be installed via specific instructions located in each sub-project.

Documentation
----------------

* Read the [Getting Started guide][1] if you are new to Delven.
* Try the [Delven Explorer application][2] to learn Delven features.


## LXC / LXD

```sh
sudo apt-get install  lxd
```

Give access to current non-root user

```sh
newgrp lxd
sudo usermod -a -G lxd $(whoami)
```

Confirm it by executing

```sh
/snap/bin/lxc query --wait -X GET /1.0
```
You should get a JSON response.


Setup new instance and login into the container

```sh
lxd init
lxc launch ubuntu:20.04 delven-invoker

lxc exec  delven-invoker -- sudo --login --user ubuntu
```

```sh
 sudo adduser greg lxd
```

NPM-Yarn migration

https://classic.yarnpkg.com/en/docs/migrating-from-npm/
https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc



https://github.com/tpokorra/lxd-scripts
https://www.cyberciti.biz/faq/how-to-create-lxd-vm-when-the-cloud-instance-launches/
https://discuss.linuxcontainers.org/t/script-run-in-lxd/3999


Source:
https://docs.npmjs.com/getting-started/fixing-npm-permissions
https://stackoverflow.com/questions/46058546/error-eacces-permission-denied-access-usr-lib-node-modules
https://ubuntu.com/tutorials/create-custom-lxd-images#1-overview
https://gist.github.com/reqshark/90bed1c082a4a5eb0a5f
https://github.com/jina-ai/jina
https://github.com/c9/
https://github.com/vercel/hyper


[1]: https://docs.delven.io
[2]: https://delven.io



