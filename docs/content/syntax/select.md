---
title: SELECT
weight: 0
type: page

menu:
  main:
    parent: syntax
---

## Selector Functions

| Name       	                                         | Spec [Data Types](/syntax/datatypes) | Value              | Description
| -------------	                                       | ------------------------------------ | -----------        | ----------------------
| [css]({{< relref  "#css-selector" >}})   	           | requied `[String, Object]`           | CSS Selector       | GET, POST, PUT, HEAD, OPTIONS, DELETE
| [xpath]({{< relref  "#xpath-selector" >}})         	 | requied `[String]`                   | XPath 2            | Name of the form to target   
| [regex]({{< relref  "#regex-selector" >}})     	     | requied `[String]`                   | Regex (Java)       | Parameters to pass   
| [headers]({{< relref  "#headers-selector" >}})   	   | optional `[Array of Strings]`        |   	               | Headers to pass to the request
| [cookies]({{< relref  "#cookies-selector" >}})    	 | optional `[Array of Strings]`        |   	               | Cookies to pass to the request
| [response]({{< relref  "#response-selector" >}})   	 | optional `[Array of Strings]`        |   	               | Cookies to pass to the request
| [snapshot]({{< relref  "#snapshot-selector" >}})  	 | optional `[Object]`                  |   	               | Generates a graphical snapshot of a web page's / selected content
  
Selectors support two types of of parameters `Implicit` and `Explicit`. 
Implicit parameters are a shorthand that allows us to pass parameter without explicity specifing that is a selector and they can be used when no addional options are needed to be passed to the Selector function.

Following  expressions are syntactically different but semantically equivalent.

```sql
   CSS Version
       
       css("#title")
       css({"selector" : "#title"})

   XPATH Version

       xpath("//a")
       xpath({"selector" : "//a"})
```

## Selector chaining
Selectors can be chained to provide fine grained selections or to simplify the expression. During selector chaining we can use any type of a selector.

```sql
  SELECT 
      css("#selector")
        .css(".sub-selector")
          .css(".another-selector") as ColumnA

    FROM  http://www.delven.io/test/index-01.html 


  SELECT 
      css("#selector")
        .xpath(".//a")
          .regex("(.+?))") as ColumnA

    FROM  http://www.delven.io/test/index-01.html 
```

## Examples

## CSS Selector

In Delve, css selectors are patterns used to select the element(s) you want to interact with.

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
  SELECT  css(".class-one") FROM  http://www.delven.io/test/index-01.html 
```

### Selector by CSS id
```sql
  SELECT  css("#id1")  FROM  http://www.delven.io/test/index-01.html 
```
### Selector by CSS attribute

```sql
  SELECT  css("[readonly=true]") FROM  http://www.delven.io/test/index-01.html 
```


## XPath Selector

```sql
  SELECT  xpath("//a") as links  FROM  http://www.delven.io/test/index-01.html 
```


## Regex Selector

```sql
  SELECT  reges("(.+?)") as links  FROM  http://www.delven.io/test/index-01.html 
```


## Snapshot Selector
Generates a graphical snapshot of a web page's content. This selector implies the dynamic document retrieval option.
Snapshot accepts two properties.


| Name       	  | Spec [Data Types](/syntax/datatypes) | Value       | Default      | Description
| -------------	| ------------------------------------ | ----------- | ------------ | -----------
| width	        | optional `[Numeric]`                 | 1...N       | 1024         | Width of the image to generate, in pixels.
| height       	| optional `[Numeric]`                 | 1...N       | Proportonal  | Height of the image to generate, in pixels.
| format    	  | optional `[String]`                 | PNG,TIF,JPG | PNG  	      | Image format to use
 
```sql 
  SELECT  snapshot({"width":1024, "height":1024, "format":"jpg"}}) as pic
     FROM  http://www.delven.io/test/index-01.html 
```



## Response Selector
Return complete response

```sql 
  SELECT  response()
     FROM  http://www.delven.io/test/index-01.html 
```


## Cookies Selector
Return cookies associated with the request

| Name       	  | Spec [Data Types](/syntax/datatypes) | Value       | Default      | Description
| -------------	| ------------------------------------ | ----------- | ------------ | -----------
| name	        | optional `[Array of Strings]`        | Cookie Name | All          | Get cookies by names


```sql 
  SELECT  cookies(["cookieA", "cookieB"])
     FROM  http://www.delven.io/test/index-01.html 
```
#### Response data
```json
 {
   "name"  : "The name of the cookie",
   "value" : "The value of the cookie"
 }
```

## Headers Selector [Headers](/ref/headers)
View the headers returned

| Name       	  | Spec [Data Types](/syntax/datatypes) | Value       | Default      | Description
| -------------	| ------------------------------------ | ----------- | ------------ | -----------
| name	        | optional `[Array of Strings]`        | Name        | All          | Name of the header

```sql
  SELECT  headers(["headerA", "Header"])
     FROM  http://www.delven.io/test/index-01.html 
```

#### Response data

```json
 {
   "name"  : "The name of the header",
   "value" : "The value of the header"
 }
```

## Selector Extensions  [W3 CSS selectors Rules](https://www.w3.org/TR/CSS21/syndata.html#value-def-identifier)

Delven adds number of css selector extensions 

| Name       	      | Example                | Description
| -----------------	| ---------------------- |--------------- 
| `:value`	        | `a:value`              | Select value of selected element
| `:first`	        | `a:first`              | Selects the first matched element
| `:last`	          | `a:last`               | Selects the last matched element



[//] https://code.tutsplus.com/tutorials/the-30-css-selectors-you-must-memorize--net-16048
[//] https://api.jquery.com/category/selectors/