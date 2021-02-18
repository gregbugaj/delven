---
title: Table designators
weight: 0
type: page
toc : true
menu:
  main:
    parent: language-elements
---

A qualifier that designates a specific object table is called a table designator. The clause that identifies the object tables also establishes the table designators for them.

## Column name qualifiers to avoid ambiguity

One reason for qualifying a column name is to designate the object from which the column comes.

`Table designators`: A qualifier that designates a specific object table is called a table designator. The clause that identifies the object tables also establishes the table designators for them. For example, the object tables of an expression in a SELECT statement are named in the FROM clause that follows it, as in the following statement:

### Ambiguity

This example show how ambiguity is resolved for single source.

```sql
SELECT * FROM  http://www.delven.io/test/index-01.html
WHERE css('#title') IN ('Title 1', 'Title 2', 'Title 3')
```

```sql
SELECT * FROM  http://www.delven.io/test/index-01.html  AS T1
WHERE T1.css('#title') IN ('Title 1', 'Title 2', 'Title 3')
```

## Ambiguity
 
```sql
SELECT * FROM 
(
	SELECT css("#title") as title
    FROM  http://www.delven.io/test/index-01.html 
) AS T1,
(
	SELECT  css("#title") as title
    FROM  http://www.delven.io/test/index-02.html 
) AS T2

WHERE T1.title IN ('Title 1', 'Title 2', 'Title 3')
```

