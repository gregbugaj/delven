# Source examples

## Basic syntax

```sql

select x, z from provider.data()

select x, z from s
select x, z from s.d()
select x, z from () => {}

select x, z from (http://www.google.com)
select x, z from http://source.com

select x, z from ['http://googl.com', 'http://www.src2.com']
```

## Variable access

Unnamed selectors are assigned an 'pseudocolumn' in the format of `@@column[INDEX]`

## Multiple-row query

```javascript
let iterator = select css('#test'), css('#test') from sourceA()
for(x of iterator){
    console.info(x)
}
```

```javascript
for(x of select css('#test'), css('#test') from sourceA()){
    console.info(x)
}
```

## Destructuring assignment

Single-row query

```javascript
let [x, y] = select css('#test'), css('#test') from sourceA()
```

## Object literal assigement

```javascript
let x = {
    dataA: select css('#sel1') from Source(),
    dataB: using context() select css('#sel1') from Source()
  }

```

## Produce Example

```javascript
select css('#sel1'), css('#sel2')
from SourceA
produce {x , z}
```

## Using keyword : Reducers

https://docs.microsoft.com/en-us/u-sql/statements-and-expressions/process-expression
https://docs.microsoft.com/en-us/u-sql/statements-and-expressions/reduce-expression

```javascript
select css('#sel1'), css('#sel2')
from SourceA using {'reducer': reducerFunction}
```

```javascript
select css('#sel1'), css('#sel2')
from SourceA using {'reducer': (row)=>{}}
```

```javascript
select css('#sel1'), css('#sel2')
from SourceA using {'reducer': function(row){}}
```

```javascript
select css('#sel1'), css('#sel2')
from SourceA using new Reducer()
```

```javascript
select css('#sel1'), css('#sel2')
from SourceA using (new Reducer({arg1:"A"}, {arg2:"B"}), new Processor())
```

## Join

```javascript
select css('#sel1'), css('#sel2')
from SourceA join SourceB
```

## Context

Statement scoped context

```javascript
using new MockContext()
select css('#test'), css('#test') from source() where (x == 1 || true)
```

Block scoped context

```javascript
using context() {
    select css('#test'), css('#test') from sourceA()
    union
    select css('#test'), css('#test') from sourceB()
}
```

## WITHIN  [http://docs.delven.io/syntax/within/]

WITHIN clause is used to narrow results down

```javascript
select css('#sel1'), css('#sel2')
within css('#container-a'), nativeContainer()
from SourceA
```

## Datasources

```javascript
 select me from  source()

 //([{"smith", 10, "2025-01-01"}, {"smith", 10, "2025-01-01"}])
```

## Returning from a function

```javascript
function xy() {
  return select css('#sel1') from Source()
}
```

```javascript
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

```javascript
function xy() {
  return
  (
     select css('#sel1') from Source()
     union
     select css('#sel1') from Source()
  )
}
```

### Arrow Function

```javascript
let y = ()=>select css('#sel1') from Source()
```


## Subquery

```javascript
select css('#a') , z from (select css('#a') from zz) where (x==1)
```

## Composite

```javascript
select css('#s', '#m') as s, css('#z') as z from http://google.com where 1==1 || 2==2 && css('#s') == true
```
