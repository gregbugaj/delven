---
title: Element Selection
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "Development", "javascript", "selectors" ]
---

How to use Selector in Delven

Selectors tell Delven which DOMElements we will be operating on. Selectors used for for DOM manipulation are similar to selectors used for data selector in [SELECT](/syntax/select) clause.

## Selector types

| Name       	                                           | Spec [Data Types](/syntax/datatypes) | Description
| -------------	                                         | ------------------------------------ | -----------------
| [by-css]({{< relref  "#by-css" >}})                    | required `[String]`                  | Select using CSS 
| [by-name]({{< relref  "#by-name" >}})                  | required `[String]`                  | Select using element name
| [by-xpath]({{< relref  "#by-index" >}})   	           | required `[String]`                  | Select using XPath
| [by-regex]({{< relref  "#by-regex" >}})   	           | required `[String]`                  | Select using regular expressions
 
## Requirement

```json
[
  {
    "by-XXXXX"  : "SELECTOR",    
    "filter" : ""
  }
]
```

## Examples

For concreate example for specific types visit.

* [Text Box](#)
* [Buttons](#)
* [Check Boxes](#)
* [Dropdowns](#)


## CSS Selector {#by-css}

In Delven, css selectors are patterns used to select the element(s) you want to interact with.

| Selector       	            | Example               | Description                                 | Reference
| --------------------------- | --------------------- | ------------------------------------------- | ------------------
| .class                      | .intro                | Selects all elements with class="intro"     | 
| #id                         | #firstname            | Selects the element with id="firstname"     | [ID selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/ID_selectors)
| [attribute=value]           | [redonly=true]        | Selects all elements with redonly="true"    | 


```html
  <span id="id1" class="class-one intro" redonly="true">Here's a span with some text.</span>
  <span id="id2" class="class-two intro">Here's a span with some text.</span>
```

### Selector by CSS classname

```sql
SELECT * FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css" : ".class-one"   
  }
]
```

### Selector by CSS id

```sql
SELECT * FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css" : "#id1"   
  }
]
```

### Selector by CSS attribute

```sql
SELECT * FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css" : "[redonly=true]"   
  }
]
```

[CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.asp)