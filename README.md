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

Setup new instance and login into the container

```bash
lxd init
lxc launch ubuntu:18.04 delven-invoker

lxc exec  delven-invoker -- sudo --login --user ubuntu
```

Source:
https://docs.npmjs.com/getting-started/fixing-npm-permissions
https://stackoverflow.com/questions/46058546/error-eacces-permission-denied-access-usr-lib-node-modules
https://ubuntu.com/tutorials/create-custom-lxd-images#1-overview
https://gist.github.com/reqshark/90bed1c082a4a5eb0a5f


[1]: https://docs.delven.io
[2]: https://delven.io
