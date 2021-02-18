---
title: CRAWL
weight: 0
type: page
toc : true
---

Delven can move automatically from one page to another. This behavior, called crawling, is enabled using the following syntax: 

 
## Specification

| Name        	| Spec [Data Types](/syntax/datatypes) | Default      | Description
| -------------	| ------------------------------------ | ------------ | -----------
| depth  	    | optional `[Number]`                  | 2            | How deep will the link be followed
| follow        | optional `[String]`                  | All links    | Selector to follow
| using         | optional `[Object]`                  | N/A          | USING clause



```json
CRAWL
{
    "depth" : 2,
    "follow" : css("#comments a")
}
```

## Basic usage
This query retrieves data by crawling three layers deep within a web site: 

```sql
SELECT  css('#title') as title
FROM  http://www.delven.io/test/index-01.html 
CRAWL
{
    depth : 3
}
```

## Following links

```sql
SELECT  css("#title") as title
FROM http://www.delven.io/test/index-01.html
CRAWL
{
    depth  : 2
    follow : css("#comments a"),   
}
```

Script that will crawl to depth 2 over all supplied links
```sql
SELECT  css("#title") as title
FROM
[
    http://www.delven.io/test/index-01.html,
    http://www.delven.io/test/index-02.html,
    http://www.delven.io/test/index-03.html
]
CRAWL
{
    depth : 2,
    follow : css("link a")
}
```


## Supplying parameters

```sql
SELECT  css("#title") as title
FROM http://www.delven.io/test/index-01.html
CRAWL
{
    depth  : 2
    follow : css("link a"),
    using  :
    {
            "method" : "GET",
            "params" :
            {
                    "q": "greg",
                    "m" : "text"
            }
    }
}

```