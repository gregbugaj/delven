---
title: USING
weight: 0
type: page

menu:
  main:
    parent: syntax
---
Specifies the condition used to retieve the URL.  USING clause used JSON like format for specifying the clause.
 
## Specification

| Name        	| Spec [Data Types](/syntax/datatypes) | Value       | Default      | Description
| -------------	| ------------------------------------ | ----------- | ------------ | -----------
| method  	    | optional `[String]`                  | HTTP Verb   | GET          | GET, POST, PUT, HEAD, OPTIONS, DELETE
| form        	| optional `[String]`                  | Form Name   | main   	    | Name of the form to target   
| params      	| optional `[Object of Key:Value]`     |   	         |  	          | Parameters to pass   
| headers   	  | optional `[Array of Strings]`        |   	         |   	          | Headers to pass to the request
| cookies   	  | optional `[Array of Strings]`        |   	         |   	          | Cookies to pass to the request
 
## Parameter structure
```json
{
    "method" : "POST",
    "form"   : "main",
    "params" :
    {
            "p1": "valueA",
            "p2": "valueB",
    },
    
    "headers" : ["Accept: application/xml", "Content-Type: application/xml"],
    "cookies" : ["token=1212", "another=value"]    
}
```

## Examples

### A. POST data to remote server via named form
This example used a named form and a POST method.

```sql
  SELECT  css('#title') as title
  FROM  http://www.delven.io/test/index-01.html
  USING
  {
        "method" : "POST",
        "form" : "main",
        "params" :
        {
                "p1": "valueA",
                "p2": "valueB",
        }
  }
```

### B. Adding header to a request

```sql
  SELECT  css('#title') as title
  FROM   http://www.delven.io/test/index-01.html
  USING
  {        
 	   "headers": ["Accept: application/xml", "Content-Type: application/xml"]     
  }
```

### B. Adding cookie to a request
This example adds multiple cookies to the request

```sql
  SELECT  css('#title') as title
  FROM   http://www.delven.io/test/index-01.html
  USING
  {        
 	 "cookies": ["token=1212", "another=value"]     
  }
```


### C. Using HEAD request

```sql
  SELECT  headers()
  FROM   http://www.delven.io/test/index-01.html
  USING
  {
        "method" : "HEAD",    
  }
```