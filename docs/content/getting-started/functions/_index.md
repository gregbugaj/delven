---
title: Functions
weight: 0
toc : true
type: index

---

Functions


### Returning from a function

```js
function xy() {
    return select css('#sel1') from Source()
  }
```

### Arrow Function

```js
let y = () => select css('#sel1') from Source()
```

### Returning from a function with context

```js
function xy() {
  return (
    using context(){
    select css('#sel1') from Source()
    union
    select css('#sel1') from Source()
  }
  )
}
```
