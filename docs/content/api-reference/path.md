---
title: Path
weight: 0
toc : true
type: page

menu:
  main:
    parent: api-reference

tags : [ "path", "api", "javascript"]
---

The `path` module provides utilities for working with file and directory paths.

Goal of this inerface is to be compatible with [Node.js Path API](https://nodejs.org/api/path.html)

Compatibility objective : `100%`

To use this module:

```
const path = require('path');
```

## path.extension(path)

* path [`<string>`]({{< relref "/syntax/datatypes#string" >}})  Path of the file to check
* Returns: [`<string>`]({{< relref "/syntax/datatypes#string" >}}) extension

Get the the extension of the path, from the last occurrence of the `.`

## path.extname(path)

Alias for `path.extension(path)`

## path.dirname(path)

* path [`<string>`]({{< relref "/syntax/datatypes#string" >}})  Path of the file to check
* Returns: [`<string>`]({{< relref "/syntax/datatypes#string" >}}) directory name

Get the directory name of a path, similar to the Unix dirname command.

```
path.dirname('/tmp/dir1/dir2');
// Returns: '/tmp/dir1'
```

A `TypeError` is thrown if path is not a string.

## path.isAbsolute(path)

* path [`<string>`]({{< relref "/syntax/datatypes#string" >}})  Path of the file to check
* Returns: [`<boolean>`]({{< relref "/syntax/datatypes#boolean" >}}) `true` if the path is absolute `false` otherwise

Determine if path is an absolute path

## path.resolve(rel, abs)

* rel [`<string>`]({{< relref "/syntax/datatypes#string" >}})  
* abs [`<string>`]({{< relref "/syntax/datatypes#string" >}})  
* Returns: [`<string>`]({{< relref "/syntax/datatypes#string" >}}) absolute path

Resolve path segments into aboslute path.