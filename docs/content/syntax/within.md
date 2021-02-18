---
title: WITHIN
weight: 0
type: page

menu:
  main:
    parent: syntax
---

WITHIN clause is used to narrow results down 

## Basic usage

```sql
SELECT  css('#title') as title 
WITHIN css(".content-container")
FROM  http://www.delven.io/test/index-01.html 
```


## Multiple filters

```sql
SELECT  css('#title') as title
WITHIN [css(".content-container-a"), css(".content-container-b")]
FROM  http://www.delven.io/test/index-01.html 
```


```sql
SELECT  css('#title') as title
WITHIN [css(".content-container-a"), css(".content-container-b")]
FROM  http://www.delven.io/test/index-01.html 
WHERE  
    css(".content-container-a .title") LIKE ('Test 1', 'Test 2')
    OR
    css(".content-container-b .title") LIKE ('Test 3', 'Test 4')
```



