---
title: JOIN
weight: 0
type: page

menu:
  main:
    parent: syntax
---

While you can create basic queries using one select segment, joining select statements together allows you to create more complex queries.

A join clause take two soures as inputs. All joins are equijoins and all oprations are 'AND' operations.

Types of supported joins.

* Inner join
* Left outer join
* Group join

## Syntax


## Inner join
 Inner join produces a result set in which each element of the first collection appears one time for every matching element in the second collection.

### Join with single conditions

```sql
select * FROM 
(
	SELECT 1 as id, 2 as val
) AS T1

JOIN (SELECT 1 as id, 2 as val) AS T2  ON [{"left" : {"ID" : T1.ID}, "right" :{"ID" : T2.ID}} ]
```

### Join with multiple conditions : Composite Keys

This example show how to perform a join operation in which you want to use more than one key.
The names of the properties must be identical in each key.

```sql
select * FROM 
(
	SELECT 1 as id, 2 as val
) AS T1

JOIN (SELECT 1 as id, 2 as val) AS T2  ON
{
	"left"  : {"ID" : T1.ID, "VAL" : T1.VAL},
	"right" : {"ID" : T2.ID, "VAL" : T2.VAL}
}
```

### Join with multiple sources : Composite Keys

```sql
select * FROM 
(
	SELECT 1 as id, 2 as val
) AS T1

JOIN (SELECT 1 as id, 2 as val) AS T2  ON {"left" : {"ID" : T1.ID}, "right" :{"ID" : T2.ID}}
JOIN (SELECT 1 as id, 2 as val) AS T3  ON {"left" : {"ID" : T1.ID}, "right" :{"ID" : T3.ID}}
```

## Left outer join
In a left outer join, all the elements in the left source sequence are returned, even if no matching elements are in the right sequence.


### Default value

You can use `null` as the default value , or you can specify a user-defined default value using `default` attribute.

```sql
select * FROM 
(
	SELECT 1 as id, 2 as val
) AS T1

JOIN (SELECT 1 as id, 2 as val) AS T2  ON
{
	"left"    : {"ID" : T1.ID, "VAL" : T1.VAL},
	"right"   : {"ID" : T2.ID, "VAL" : T2.VAL}
	"default" : {"id": 1, "val" : 2}
}
```



## Group join
A join clause with an into expression is called a group join.

A group join produces a hierarchical result sequence, which associates elements in the left source sequence with one or more matching elements in the right side source sequence. A group join  is essentially a sequence of object arrays

Simply put Group joins allows us to collapse our JOIN into an Array objects, that are grouped by JOIN clause.

 ```sql
select * FROM 
(
	SELECT 1 as id, 2 as val
) AS T1

JOIN (SELECT 1 as id, 3 as val) AS T2  ON
{
	"left"    : {"ID" : T1.ID},
	"right"   : {"ID" : T2.ID}
} INTO JoinData
```

This will produce following stucture

```json
  {
    "id" : "1",
    "val"  : [
      {"id" : "1", "val": 2},
	  {"id" : "1", "val": 3}
    ]
  }
```

