---
title: NATIVE
weight: 0
type: page

menu:
  main:
    parent: syntax
---

NATIVE clause allows us to execute Javascript directly on the loaded document

See [JavaScript Execution](/event-flow/executing-javascript) for details and examples

## Syntax

```json
  NATIVE "script.js"
```

## Usage

```sql
  SELECT  css("#id1")  FROM  http://www.delven.io/test/index-01.html 
  NATIVE "script.js"
```