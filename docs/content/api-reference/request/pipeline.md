---
title: Request Pipeline
weight: 0
toc : true
type: page

menu:
  main:
    parent: request

tags : [ "request", "api", "javascript"]
---

## Request Pipeline

Pipelines allow for chaing requests

```
const request = require('request').create();

const onRequestSent = function(request) {
    console.info("Sending request : %s", request);
}

const onRequestReceived = function (request, response) {
    console.info("Receiving request ");
}

request.on('resource.requested', onRequestSent);
request.on('resource.received',  onRequestReceived);

request.start().next(() => {
    console.info("Start **");

    this.open('https://www.google.com/').next(() => {
        // Evaluate function in the context of the loaded page
        this.evaluate(function () {
            console.info("Document Title");
        });
    });
});

request.run();
```
