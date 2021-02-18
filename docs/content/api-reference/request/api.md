---
title: Request API
weight: 0
toc : true
type: page

menu:
  main:
    parent: request

tags : [ "request", "api", "javascript"]
---

## request.create

## request.createStep(fn, options)

Creates a step definition

| Name        	  | Spec [Data Types](/syntax/datatypes)                      | Description
| -------------	  | ----------------------------------------                  | -----------
| fn    	      | [function]({{< relref  "/syntax/datatypes#function" >}})  | The step function to call
| options    	  | [object]({{< relref  "/syntax/datatypes#function" >}})    | Step options
|          	      | timeout                                                   | Timeout period before request is considered dead (default:none)
|          	      | waitTimeout                                               | Wait timeout between requests (default:5000)


## request.then(step, options)

Add processing step to current navigation.  Calling this method after the run have started will result in the step being inserted as next one in the queue

| Name        	  | Spec [Data Types](/syntax/datatypes)                      | Description
| -------------	  | ----------------------------------------                  | -----------
| fn    	      | [function]({{< relref  "/syntax/datatypes#function" >}})  | The step function to call
| options    	  | [object]({{< relref  "/syntax/datatypes#function" >}})    | Step options
|          	      | timeout                                                   | Timeout period before request is considered dead (default:none)
|          	      | waitTimeout                                               | Wait timeout between requests (default:5000)

```
const request = require('request').create();
request.start('http://www.google.com');
request.then(() => { console.info('Step 1') });

request.then(() => {
    console.info('Step 2');
    request.then(() => { console.info('Step 2.1') })
});

request.then(() => { console.info('Step 3') });

request.then(function () {
    console.info('Step 4');
    console.info(this);
    this.then(() => { console.info('Step 4.1') })
    this.then(() => { console.info('Step 4.2') })
    this.then(() => { console.info('Step 4.2'); this.then(() => { console.info('Step 4.2.3') }) })
    this.then(() => { console.info('Step 4.3') })
});

// Start processing
request.run();

```

## request.addStep(step)

## request.open(url, options)

Open given resource

* url
* options

## request.start(url)

Start Step of the navigation

* url

## request.dispatch(scope, method, args)

Start Step of the navigation

* scope
* method
* args

## request.run(url)

Run all steps

* url

## Events

### Event : step.added

### Event : step.created

### Event : step.start

### Event : step.complete

### Event : step.error