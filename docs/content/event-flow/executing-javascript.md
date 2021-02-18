---
title: JavaScript Execution
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "Development", "javascript", "dynamic" ]
---

Executing script on loaded document

## Arguments

## Examples


### A. Execute JavaScript function

```sql
SELECT * 
FROM http://www.delven.io/test/execute.html
EVENTFLOW
{
  "execute" : ["window.scrollTo(0, 0)", "document.write('Hello World')"]
}
```

### A. Execute JavaScript on [DOMElement] (https://developer.mozilla.org/en-US/docs/Web/API/Element)

Before a funtion can be executed a DOMElement first need to be located

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html 
EVENTFLOW
[
  {
    "by-css"    : "#btn",
    "execute" :  ["$.click()"]
  }
]
```

## Full JavaScript support : ECMAScript 6 
Delven allows for low lever interaction with documents via JavaScript(ECMAScript 6+) scripts.
The `native` keyword is applied to a script to indicate that the script is implemented in native code.

### Context Object

| Name       	       | Spec [Data Types](/syntax/datatypes) | Description
| -------------	     | ------------------------------------ | -----------------
| args               |  `Object of Key:Value`               | Parameters passed to the function
| session            |  `Object of Key:Value`               | Contains information about current extract session
| document           |  `DOMDocument        `               | Currently loaded document
| config             |  `Object of Key:Value`               | Request configuration


Native method can return three different types of results.

* Simple value
* JSON Object
* Object Array

NULL values will throw an exception.

## Examples 

### Calling native function

Following example will call `page-interceptor.js` afer page have been loaded and execute `product` intercept function.
Calling native functions takes a special `$` prefix such as `$product`

```sql
SELECT $product() AS product
FROM http://www.delven.io/test/execute.html 
NATIVE "page-interceptor.js"
```

### Passing arguments to function
Arguments passed to the function take an JSON object and can be accessed from the `context` object via `context.args`.

```sql
SELECT $product({"field":"product"}) AS product
FROM http://www.delven.io/test/execute.html 
NATIVE "page-interceptor.js"
```


### Script to execute : page-interceptor.js

```js
export function product(context) 
{
    var arg = context.args;
    var $   = context.jQuery;
  
    var result =
    {
        name: $('.productName h1').text().trim(),
        price: $('.price .value').text().trim(),
        description: $('.description[itemprop="description"]').text().trim()
    };

    return result;
}
```


## Page Interceptors : intercept.js
There are cases when we want to capture and manipulate requests/responses before they get processed by the interpetter.

Interceptors allow you to:

* Intercept a request by implementing the `request` function: This method is called before reguest is send to the backend.

* Intercept a response by implementing the `response` function: This method is called right after interpretter receives the response from the backend, so you can modify the response and make other actions.


[//]: #http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/

```js
  var interceptor = 
  {
      request: function(context) 
      {
          var document = context.document;   
          var config   = context.config;             
          config.headers['x-session-token'] = 'secret-token';            
      },

      response : function(context) 
      {
          var document = context.document;   
          document.title = 'Intercepted Document'          
      }
  };

 // Register our interceptor
 $psql.config.addInterceptor(interceptor);
 
```


## Adding dependencies : require