---
title: Intercepting Request
weight: 0
toc : true
type: page

menu:
  main:
    parent: request

tags : [ "request", "api", "javascript"]
---

## Events

### Event resource requested

The 'resource.requested' event is emitted when a request is started.

| Name        	                                | Spec [Data Types](/syntax/datatypes)    | Description
| -------------	                                | ----------------------------------------| -----------
| request 	                                    | `Request`                               | Reference to the request object

```
const request = require('request').create();

request.on('resource.requested', (request) => {
  console.info("Sending request");
});

request.start('http://www.google.com').then(() => {
    console.info("Page load complete **");
});

request.run();
```

### Event resource received

The 'resource.received' event is emitted when a request is received from the source.

| Name        	                                | Spec [Data Types](/syntax/datatypes)    | Description
| -------------	                                | ----------------------------------------| -----------
| request 	                                    | `Request`                               | Reference to the request object
| response 	                                    | `Response`                              | Reference to the response object

```
const request = require('request').create();

request.on('resource.received', (request, response) => {
   console.info("Receiving request");
});

request.start('http://www.google.com').then(() => {
    console.info("Page load complete **");
});

request.run();
```

## Sample request interceptor

```
const request = require('request').create();

const onRequestSent = function(request)
{
    console.info("Sending request");
}

const onRequestReceived = function (request, response) {
    console.info("Receiving request");
}

request.on('resource.requested', onRequestSent);
request.on('resource.received',  onRequestReceived);


request.start('http://www.google.com').then(() => {
    console.info("Page load complete **");
});

// Start processing
request.run();

```