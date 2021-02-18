---
title: Select
weight: 0
toc : true
type: index

---

This tutorial uses examples of the basis usage of `SELECT` statement


* [Example 001](/)
* [Example 002](/)
* [Example 003](/)


## Different select types

```js
select x, z from s.()

select x, z from s
select x, z from s.()
select x, z from () => {}


// Select from URI

select x, z from (http://www.google.com)
select x, z from http://source.com

select x, z from ['http://googl.com', 'http://www.src2.com']

```

## Example 1

```js
  let x = select x, y from source()
```

Transpiled

```js
let x = From(source())
        .Select((row, index)=> {
            return {'x': row.x}
        })
```



## Example 2

```js
let iterator = select css('#test'), css('#test') from sourceA()

for (x of iterator) {
    console.info(x)
}

```

Transpiled

```js
let iter = From(source())
        .Select((row, index)=> {
            return {'x': row.x}
        })

for (x of iter) {
    console.info(x)
}
```