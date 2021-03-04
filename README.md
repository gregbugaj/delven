# Delven

Delven is a Domain Specific Language (DSL) designed for mining content from static and dynamic sources, It closely resembles SQL with features borrowed from other popular languages. Delven is ECMAScript2020 compatible as it uses Source-To-Source transpiller so at the end of the day there are no special runtimes required.


Installation
----------------

`setup.sh` script can be used to perform initial install

```bash
. ./setup.sh
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




Source:
https://docs.npmjs.com/getting-started/fixing-npm-permissions
https://stackoverflow.com/questions/46058546/error-eacces-permission-denied-access-usr-lib-node-modules



[1]: https://docs.delven.io
[2]: https://delven.io
