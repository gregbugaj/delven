# Source examples

## Basic syntax
```sql

select x, z from s.()

select x, z from s
select x, z from s.()
select x, z from () => {}


select x, z from (http://www.google.com)
select x, z from http://source.com

select x, z from ['http://googl.com', 'http://www.src2.com']
```

## Variable access
Unnamed selectors are assigned an 'pseudocolumn' in the format of `@@column[INDEX]`

## Multiple-row query

```sql
let iterator = select css('#test'), css('#test') from sourceA()
for(x of iterator){
    console.info(x)
}
```

```sql
for(x of select css('#test'), css('#test') from sourceA()){
    console.info(x)
}
```

## Destructuring assignment
Single-row query
```sql
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

```sql
select css('#sel1'), css('#sel2') 
from SourceA
produce {x , z}
```

## Using keyword : Reducers
https://docs.microsoft.com/en-us/u-sql/statements-and-expressions/process-expression
https://docs.microsoft.com/en-us/u-sql/statements-and-expressions/reduce-expression

```sql
select css('#sel1'), css('#sel2') 
from SourceA using {'reducer': reducerFunction}
```

```sql
select css('#sel1'), css('#sel2') 
from SourceA using {'reducer': (row)=>{}}
```

```sql
select css('#sel1'), css('#sel2') 
from SourceA using {'reducer': function(row){}}
```

```sql
select css('#sel1'), css('#sel2') 
from SourceA using new Reducer()
```

```sql
````select css('#sel1'), css('#sel2') 
from SourceA using (new Reducer({arg1:"A"}, {arg2:"B"}), new Processor())````
```

## 

```sql
select css('#sel1'), css('#sel2') 
from SourceA join SourceB 
```

## Context

Statement scoped context
```sql
using new MockContext()
select css('#test'), css('#test') from source() where (x == 1 || true)
```

Block scoped context

```sql
using context() {
    select css('#test'), css('#test') from sourceA()
    union 
    select css('#test'), css('#test') from sourceB()
}
```

## WITHIN  [http://docs.delven.io/syntax/within/]

WITHIN clause is used to narrow results down

```sql
select css('#sel1'), css('#sel2') 
within css('#container-a'), nativeContainer()  
from SourceA
```

## Datasources

```js
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

```sql
select css('#a') , z from (select css('#a') from zz) where (x==1)
```
