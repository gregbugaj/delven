---
title: Attributes
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : ["attributes", "eventflow"]
---

Interacting with Element Attributes

## Parameter Specification

| Name       	                                           | Spec [Data Types](/syntax/datatypes) | Description
| -------------	                                         | ------------------------------------ | -----------------
| [attribute]({{< relref  "#select-by-index" >}})        | optional `Object of Key:Value`       | Set attribute value

 
## Example 

```html
  <input type="text" id="info" value="" data-a="Value A"  data-b="Value B">  
```
### Setting Attribute Values

```sql
SELECT css("#info[data-a]") as aval, css("#info[data-b]") as bval 
FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css": "#info",
    "attribute": 
      {
        "data-a": "New Value A",
        "data-b": "New Value B"
      }
  }
]
```

### Results

```json
{
   "aval": 
   {
      "value": "New Value A"
   },
    "bval": 
   {
     "value": "New Value B"
   }
}
```