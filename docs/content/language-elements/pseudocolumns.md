---
title: Pseudocolumns
weight: 0
type: page
toc : true
menu:
  main:
    parent: language-elements
---

In addition to columns provided by input objects, Delven provides pseudocolumns, which expressions can also reference. 
Some pseudocolumns are only available to expressions in certain contexts. Others are generally available to any expression. 

## Specification

| Name        	    | Description
| ----------------  | --------------------------------------------------------------------
| PS.FETCH_ID  	    | The sequential ID of the current fetch. This ID is global across the entire query.
| PS.REQUEST_URL    | The URL initially visited to load the document, prior to any redirection
