# Delven

Delven is a Domain Specific Language (DSL) designed for mining content from static and dynamic sources, It closely resembles SQL with features borrowed from other popular languages. Delven is ECMAScript2020 compatible as it uses Source-To-Source transpiller so at the end of the day there are no special runtimes required.


Installation
----------------

`setup.sh` script can be used to perform initial install
Passing the `--audit` flag will

```bash
. ./setup.sh

. ./setup.sh --audit
```

Invidual project can be installed via specific instructions located in each sub-project.


Documentation
----------------

* Read the [Getting Started guide][1] if you are new to Delven.
* Try the [Delven Explorer application][2] to learn Delven features.



Setup Issues
--------------


https://stackoverflow.com/questions/58462570/how-to-use-npm-link-with-a-module-writte$ cd ./package-dirn-using-typescript-for-development


Error during `npm link`
Error: EACCES: permission denied, symlink

```
It's not recommended to use sudo with npm install, follow the steps from npmjs official docs instead :)

Make a directory for global installations:

mkdir ~/.npm-global

Configure npm to use the new directory path:

npm config set prefix '~/.npm-global'

Open or create a ~/.profile file and add this line:

export PATH=~/.npm-global/bin:$PATH

Back on the command line, update your system variables:

source ~/.profile

Test: Download a package globally without using sudo.

npm install -g typescript
```

## LXC / LXD

```bash
sudo apt-get install  lxd
```

Give access to current non-root user

```bash
newgrp lxd
sudo usermod -a -G lxd $(whoami)
```

Confirm it by executing

```bash
/snap/bin/lxc query --wait -X GET /1.0
```
You should get a JSON response.


Setup new instance and login into the container

```bash
lxd init
lxc launch ubuntu:20.04 delven-invoker

lxc exec  delven-invoker -- sudo --login --user ubuntu
```

```
 sudo adduser greg lxd
```

https://github.com/tpokorra/lxd-scripts
https://www.cyberciti.biz/faq/how-to-create-lxd-vm-when-the-cloud-instance-launches/
https://discuss.linuxcontainers.org/t/script-run-in-lxd/3999


Source:
https://docs.npmjs.com/getting-started/fixing-npm-permissions
https://stackoverflow.com/questions/46058546/error-eacces-permission-denied-access-usr-lib-node-modules
https://ubuntu.com/tutorials/create-custom-lxd-images#1-overview
https://gist.github.com/reqshark/90bed1c082a4a5eb0a5f
https://github.com/jina-ai/jina


[1]: https://docs.delven.io
[2]: https://delven.io



