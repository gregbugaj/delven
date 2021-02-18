---
title: INSERT
weight: 0
type: page

menu:
  main:
    parent: syntax
---

Delven uses a simple syntax to store results. The INTO clause always comes after the SELECT statement.
Extraction results are stored in collections, collection is a container for a JSON documents.

## Syntax

## Examples


### Inserting 

This is minimalistic example of our INSERT clause.

```sql
  SELECT css("#header"), css("#title")  FROM  http://www.delven.io/test/index-01.html   
  INSERT HeaderCollection   
```

This will result in a document to be inserted into a `HeaderCollection` for each of the returned matches. 
So if there were two `#header` id in the page we will have two documents inserted.

```json
  {
    "$1" : "Header 1",
    "$2" : "Title  1"
  },
  {
    "$1" : "Header 2",
    "$2" : "Title  2"
  } 
```



### Controlling column names
As we could see in previous example column names were anonymous and the actuall key values have been generated automatically.

To specify a explicit name we use the `AS` keyword.

```sql
  SELECT css("#header") AS Header, css("#title") AS Title  
  FROM  http://www.delven.io/test/index-01.html   
  INSERT HeaderCollection 
```
Here is version that uses explicit column names, this is more verbose but it allows us to controll exactly what will be inserted.

```sql
  SELECT css("#header") AS Header, css("#title") AS Title  
  FROM  http://www.delven.io/test/index-01.html   
  INSERT HeaderCollection 
  {
    "Header" : Header,
    "Title"  : Title
  }
```

Both examples will produces results with more meaningful names.

```json
  {
    "Header" : "Header 1",
    "Title"  : "Title  1"
  },
  {
    "Header" : "Header 2",
    "Title"  : "Title  2"
  } 
```

### Adding default values

Sometimes it is preferable to provide default values for data that is not present.

```sql
  SELECT css("#header") AS Header, css("#title") AS Title  
  FROM  http://www.delven.io/test/index-01.html   
  INSERT HeaderCollection 
  {
    "Header" : {"value" : Header, "default" : "Default Header"},        
    "Title"  : Title
  }
```


### Multivalue insert 
Here we have an example where we select a single  `#header` and all the links inside that header with `#header a` selector.

```sql
  SELECT css("#header") AS header, css("#header a") AS links 
  FROM  http://www.delven.io/test/index-01.html   
  INSERT HeaderCollection 
```
This produces 

```json
  {
    "header" : "Header 1",
    "links"  : [
      {"value" : "Link Text 1", "href": "http://link1"},
      {"value" : "Link Text 2", "href": "http://link2"},
      {"value" : "Link Text 3", "href": "http://link2"}
    ]
  }
```
### Multivalue insert with Group Join

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

INSERT HeaderCollection
{
  "id": id,
  "data" : JoinData

}
```
This will produce following stucture

```json
  {
    "id" : "1",
    "data"  : [
      {"id" : "1", "val": 2},
	    {"id" : "1", "val": 3}
    ]
  }
```
