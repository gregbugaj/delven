---
title: Textbox
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "css", "textbox", "eventflow"]
---

Interacting with Texboxes


## Parameter Specification

| Name       	                                           | Spec [Data Types](/syntax/datatypes) | Description
| -------------	                                         | ------------------------------------ | -----------------
| [value]({{< relref  "#select-by-index" >}})            | optional `[String]`                  | Set value

 
## Example 


```html
  <input type="text" id="firstname" value="">
```
## Setting Values

### Setting single value

```sql
SELECT css("#firstname") FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css": "#firstname",
    "value": "Greg"   
  }
]
```

```json
{  "column_1" : {"value" : "Greg"} }
```

### Setting multiple values
```sql
SELECT css("#firstname") as first , css("#lastname") as last 
FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css": "#firstname",
    "value": "Greg"   
  },
  {
    "by-css": "#lastname",
    "value": "B."   
  }
]
```


```json
{
   "first": 
   {
      "value": "Greg"
   },
    "last": 
   {
     "value": "B."
   }
}
```