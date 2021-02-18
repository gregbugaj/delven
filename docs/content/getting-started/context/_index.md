---
title: Context
weight: 0
toc : true
type: index

---

Context

### Block scoped context

```js
using context() {
    select css('#test'), css('#test') from sourceA()
    union
    select css('#test'), css('#test') from sourceB()
}
```

###  Statement scoped context

```js
using new MockContext()
select css('#test'), css('#test') from source() where(x == 1 || true)
```
