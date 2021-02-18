---
title: Buttons
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "css", "textbox", "eventflow"]
---

Interacting with Buttons


## Parameter Specification

| Name       	                                           | Spec [Data Types](/syntax/datatypes) | Description
| -------------	                                         | ------------------------------------ | -----------------
| [value]({{< relref  "#" >}})                           | required `[String]`                  | Set value
| [event]({{< relref  "#" >}})                           | required `[String]`                  | Invoke event



```json
  "event[1]"  : "click"
]
```
 
## Example 


```html
  <button type="button" id="btn">Click Me!</button>
```
## Setting Value

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html 
EVENTFLOW
[
  {
    "by-css": "#btn",
    "value": "New Button Name"   
  }
]
```

```json
{  "column_1" : {"value" : "New Button Name"} }
```

## Invoking Click Event

Following example will select our `button` and then perform an `click` action.

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html 
EVENTFLOW
[
  {
    "by-css"    : "#btn",
    "event[1]"  : "click"
  }
]
```

[//] (https://www.w3schools.com/jsref/dom_obj_event.asp)