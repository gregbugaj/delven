---
title: Reducers
weight: 0
toc : true
type: index

---

Reducers provides the ability to write custom row reducers.


* [Example 001](/)
* [Example 002](/)
* [Example 003](/)


```js
select css('#sel1'), css('#sel2')
from SourceA using { 'reducer': reducerFunction }
```


```js
select css('#sel1'), css('#sel2')
from SourceA using { 'reducer': (row) => { } }
```


```js
select css('#sel1'), css('#sel2')
from SourceA using new Reducer()
```