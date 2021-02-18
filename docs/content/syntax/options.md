---
title: OPTIONS
weight: 0
type: page

menu:
  main:
    parent: syntax
---

Certain options are Enabled/Disabled by default and they can be controlled with `OPTIONS` clause.

## Syntax

```json
  OPTIONS
  {
      "OptionName1" : "Value",
	  "OptionName2" : "Value"
  }
```
## Specification

| Name                      | Spec [Data Types](/syntax/datatypes) | Value       | Default      | Description
| ------------------------- | ------------------------------------ | ----------- | ------------ | -----------
| implicit-conversion  	    | `[Boolean]`                          | true,false  | True         | Automatic type conversion


## Usage

```sql
  SELECT  css("#id1")  FROM  http://www.delven.io/test/index-01.html 
  OPTIONS
  {
      "implicit-conversion" : false
  }
```