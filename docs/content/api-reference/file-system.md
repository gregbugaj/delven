---
title: File System
weight: 0
toc : true
type: page

menu:
  main:
    parent: api-reference
    
tags : [ "filesystem", "api", "javascript"]
---

The `fs` module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.

Goal of this inerface is to be compatible with [Node.js File System API](https://nodejs.org/api/fs.html#fs_file_system)

Compatibility objective : `80%`

To use this module:

```
const fs = require('fs');
```

All file system operations have synchronous and asynchronous forms.

## fs.readFile(path)

Compatibility : `broken`

Open, read and return text content of a file. It will throw an exception if it fails.

* path [`<string>`]({{< relref "/syntax/datatypes#string" >}})  Path of the file to read from
* Returns : Contents of the file


```
let data = fs.readFile('/etc/passwd');
console.info('Data : {0}', data);
```

## fs.readdirSync(path, options)


Synchronous [readdir(3)](http://man7.org/linux/man-pages/man3/readdir.3.html).

* path    [`<string>`]({{< relref "/syntax/datatypes#string" >}}) Path of the directory
* options [`<object>`]({{< relref "/syntax/datatypes#object" >}}) Options
* Returns : An array of filenames excluding '.' and '..'

## fs.statSync(path)

Synchronous [stat(2)]({{http://man7.org/linux/man-pages/man2/stat.2.html}}). Returns an instance of fs.Stats.

## Class : fs.Stats

A `fs.Stats` object provides information about a file.

### stats.isDirectory()

Returns `true` if the fs.Stats object describes a file system directory.

### stats.isFile()

Returns `true` if the fs.Stats object describes a regular file.

### stats.isSymbolicLink()

Returns `true` if the fs.Stats object describes a symbolic link.

### stats.dev

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The numeric identifier of the device containing the file.

### stats.ino

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The file system specific "Inode" number for the file.

### stats.mode

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A bit-field describing the file type and mode.

### stats.nlink

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of hard-links that exist for the file.

### stats.uid

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The numeric user identifier of the user that owns the file (POSIX).

### stats.size

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The size of the file in bytes.

### stats.blksize

* [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of blocks allocated for this file.

## TODO

* Add support for Promises
* Fix broken API
