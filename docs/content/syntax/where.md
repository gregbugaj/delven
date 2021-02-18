---
title: WHERE
weight: 0
type: page

menu:
  main:
    parent: syntax
---

Specifies the search condition for the rows returned by the query.

* `Projection` means choosing which columns (or expressions) the query will return.
* `Selection` means which rows are to be returned.

## Arguments

```sql
SELECT css(".title") as title
FROM  http://www.delven.io/test/index-01.html 
WHERE css(".content-container .title")
```

 
```sql
SELECT  css('#title') as title
FROM  http://www.delven.io/test/index-01.html 
WITHIN css(".content-container")
WHERE  css(".content-container .title") LIKE ('Test 1', 'Test 2')
```

```sql
SELECT css(".title") as title
FROM  http://www.delven.io/test/index-01.html 
WHERE css(".content-container .title") LIKE ('Test 1', 'Test 2')
```



```sql
SELECT css("h1") as header
FROM  http://www.delven.io/test/index-01.html 
WHERE css({"selector":"#title", "slice":false}) LIKE ('Title 1', 'Title 2', 'Title 3')
```


## Examples

### A. Finding a row by using a simple equality

```sql
SELECT * FROM my.datasource WHERE fielda = 100 AND field <> 'A'
```
### B. Finding rows by using a comparison operator

```sql
SELECT * FROM my.datasource WHERE fielda <= 100
```
### C. Finding rows that are in a list of values

```sql
SELECT * FROM my.datasource WHERE fielda IN (100, 200, 300)
```
