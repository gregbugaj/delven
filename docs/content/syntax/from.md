---
title: FROM
weight: 0
type: page
toc : true
menu:
  main:
    parent: syntax
---
The  FROM clause is used to specifyg source and any joined sources.

## Syntax

```
FROM <from_specification>  
  
<from_specification> ::=   
        <from_source> {[ JOIN <from_source>][,...n]}  
  
<from_source> ::=   
          <collection_expression> [[AS] input_alias]  
        | input_alias IN <collection_expression>  
  
<collection_expression> ::=   
        ROOT   
     | collection_name  
     | input_alias  
     | <collection_expression> '.' property_name  
     | <collection_expression> '[' "property_name" | array_index ']'  

```

### Arguments
`<from_source>`

Specifies a data source, with or without an alias. If alias is not specified, it will be inferred from the <collection_expression> using following rules:

* If the expression is a collection_name, then collection_name will be used as an alias.
* If the expression is <collection_expression>, then property_name, then property_name will be used as an alias. If the expression is a collection_name, then collection_name will be used as an alias. 

## Examples

### Baisc From clause

```sql
SELECT  css("#title") FROM  http://www.delven.io/test/index-01.html 
```

### Using a Suquery in the FROM clause

```sql
  SELECT  css('#title') as title
  FROM 
  (
    SELECT css('#root-selector') FROM http://www.delven.io/test/index-01.html  
  ) AS T1
```
When this query run, the subquery is first run and the results created. The results are then used in the FROM clause.


### FROM Selector 

This is equivalent to using a subquery version  

```sql
  SELECT  css('#title') as title
  FROM css('#root-selector')
  WITHIN http://www.delven.io/test/index-01.html  
```

### Composite FROM clause

Here we simply  select data from two separate soures and return them.

```sql
SELECT * FROM 
(
	  SELECT  css("#title") as title, css("#title a") as links
    FROM  http://www.delven.io/test/index-01.html 
) AS T1 ,
(
	  SELECT  css("#title") as title, css("#title a") as links 
    FROM  http://www.delven.io/test/index-02.html 
) AS T2
```

### Joining Derived Tables
You can also join two derived tables together using `WHERE` clause or a `JOIN` clause.

### Using `WHERE` clause

```sql
SELECT * FROM 
(
	  SELECT  css("#title") as title, css("#title a") as links 
    FROM  http://www.delven.io/test/index-01.html 
) AS T1
,
(
	  SELECT  css("#title") as title, css("#title a") as links
     FROM  http://www.delven.io/test/index-02.html 
) AS T2

WHERE T1.title = T2.title
```

### Using `JOIN` clause

```sql
SELECT * FROM 
(
	  SELECT  css("#title") as title, css("#title a") as links 
    FROM  http://www.delven.io/test/index-01.html 
) AS T1
JOIN
(
	   SELECT  css("#title") as title, css("#title a") as links
     FROM  http://www.delven.io/test/index-02.html 
) AS T2 AS  ON 
{
	"left"    : {"title" : T1.title},
	"right"   : {"title" : T2.title}
}

WHERE T1.css("#title").contains("Comment")
```