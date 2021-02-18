---
title: Dropdown
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "css", "dropdown", "eventflow"]
---

Interacting with Dropdowns

## Selection Types

### A. Selecting Dropdown Values 

| Name       	                                           | Spec [Data Types](/syntax/datatypes) | Description
| -------------	                                         | ------------------------------------ | -----------------
| [selectByIndex]({{< relref  "#select-by-index" >}})    | optional `[Number]`                  | Select Option by Index
| [selectByValue]({{< relref  "#select-by-value" >}})    | optional `[String]`                  | Select Option by Option Value
| [selectByText]({{< relref  "#select-by-text" >}})   	 | optional `[String]`                  | Select Value  by Option Text
 
## Example 


```html
  <select id="vehicles">
    <option value="opt-volvo">Volvo</option>
    <option value="opt-saab">Saab</option>
    <option value="opt-vw">VW</option>
    <option value="opt-audi">Audi</option>
  </select>
```
### Select Option by Index {#select-by-index}

```sql
SELECT css("#vehicles option:selected") FROM http://www.delven.io/test/execute.html 
EVENTFLOW
{
  {
    "by-css" : "#vehicles",    
    "selectByIndex"  : 1
  }
}
```

```json
{  "column_1" : {"key":"opt-volvo", "value" : "Volvo"} }
```


### Select Option by Option Value {#select-by-value}

```sql
SELECT css("#vehicles option:selected")  FROM http://www.delven.io/test/execute.html 
EVENTFLOW
{
  {
    "by-css" : "#vehicles",    
    "selectByValue"  : "opt-audi"
  }
}
```
```json
{  "column_1" : {"key":"opt-audi", "value" : "Audi"} }
```


### Select Value  by Option Text {#select-by-text}

```sql
SELECT css("#vehicles option:selected")  FROM http://www.delven.io/test/execute.html 
EVENTFLOW
{
  {
    "by-css" : "#vehicles",    
    "selectByText"  : "Saab"
  }
}
```

```json
{  "column_1" : {"key":"opt-saab", "value" : "Saab"} }
```