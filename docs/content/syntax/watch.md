---
title: WATCH
weight: 0
type: page

menu:
  main:
    parent: syntax
---

WATCH clause allows us to monitor changes to the underlying content.

| Name        	                                    | Spec [Data Types](/syntax/datatypes) | Default       | Description
| -------------                                     | ------------------------------------ | ------------  | -----------
| selector  	                                    | required `Object|Function`           |               | Selector to use for watches
| [interval]({{< relref  "#watch-interval" >}})     | optional `[String]`                  | 12:00:00      | Interval of how ofter to check for updates
| [time]({{< relref  "#watch-interval" >}})         | optional `[String]`                  | 12:00:00      | Time of day of when to check for update
| [method]({{< relref  "#watch-method" >}})         | optional `[String]`                  | value         | Watch Type

## Usage
The following example setups a `WATCH` to be executed every 30 seconds.


```sql
SELECT  css('#title') as title 
WITHIN css(".content-container")
FROM  http://www.delven.io/test/index-01.html 

WATCH
{
    "selector"  : css('#update-time')    
    "interval" : "00:00:30",
    "method" : "hash"
}
```
      

The following example setups a `WATCH` to be executed  at 10:30 P.M. (22:30).

```sql
SELECT  css('#title') as title 
WITHIN css(".content-container")
FROM  http://www.delven.io/test/index-01.html 

WATCH
{
    "selector"  : css('#update-time')    
    "time" : "00:22:30",
    "method" : "hash"
}
```

## Watch Method

| Name        	                                | Spec [Data Types](/syntax/datatypes) | Default       | Description
| -------------	                                | ------------------------------------ | ------------  | -----------
| hash  	                                    | required `Object|Function`           |               | Selector to use for watches
| value  	                                    | required `Object|Function`           |               | Selector to use for watches
