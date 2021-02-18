---
title: Cookies
weight: 0
toc : true
type: page

menu:
  main:
    parent: api-reference

---

Cookies API [mozilla](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/cookies/getAll)

The `cookie` module provides utilities for working with cookies.

To use this module:

```
const cookies = require('cookies');
```

## cookie.getAll(details)

* details [`<object>`]({{< relref "/syntax/datatypes#object" >}}) An object containing details that can be used to match cookies to be retrieved
  * name [`<string>`]({{< relref "/syntax/datatypes#object" >}})   A string representing a name that the cookies should have.
  * path [`<string>`]({{< relref "/syntax/datatypes#object" >}})   A string representing a path — the cookies' path must be identical to this one.
* Returns: [`<object>`]({{< relref "/syntax/datatypes#string" >}}) array of `cookie` objects

Retrieves all cookies from a cookie store that match the given information.

## cookie.set(cookie)

* cookie [`<object>`]({{< relref "/syntax/datatypes#object" >}}) An object containing details that can be used to match cookies to be retrieved

Set cookie

## cookie.remove(name)

Deletes a cookie by name.