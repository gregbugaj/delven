
Source examples
```sql

select x, z from s.()

select x, z from s
select x, z from s.()
select x, z from () => {}


select x, z from (http://www.google.com)
select x, z from http://source.com

select x, z from ['http://googl.com', 'http://www.src2.com']
```


## Produce Example

```sql
select css('#sel1'), css('#sel2') 
from SourceA
produce {x , z}
```

## Using keyword : Reducers

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
from SourceA using new Reducer()
```
