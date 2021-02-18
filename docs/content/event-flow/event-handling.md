---
title: Event Handling
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : [ "css", "event-handling", "eventflow"]
---

Event Handling

## Mouse Events

| Event Name       	                                     | Fired When
| -------------	                                         | ------------------------------------
| [click]({{< relref  "#" >}})                           | 	A pointing device button has been pressed and released on an element.
| [mouseover]({{< relref  "#" >}})                       | 	A pointing device is moved onto the element that has the listener attached or onto one of its children.

Events use a special syntax `"event[ID]"  : "EVENTNAME"` this allows us to specify multiple events in more compact way when multiple events are required on an object to be invoked.

```json
  "event[1]"  : "EVENTNAME", 
  "event[2]"  : "EVENTNAME"
```

## Example

```html
  <button type="button" id="btn">Click Me!</button>
```
## Setting Value

## Invoking Single Event

Following example will execute single `click` event.

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css"    : "#btn",
    "event[1]"  : "click"
  }
]
```

## Invoking Multiple Events

Following example will execute three `click` events on selected element.

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css"    : "#btn",
    "event[1]"  : "click",
    "event[2]"  : "click",
    "event[3]"  : "click"
  }
]
```

## Event Chaining
Event chaining allows us to fire events on multiple elements. Definition dictates firing order of the events.

Following example will fire two `click` events in succession on the selected elements.

```sql
SELECT css("#btn") 
FROM http://www.delven.io/test/execute.html EVENTFLOW
[
  {
    "by-css"    : "#btn",
    "event[1]"  : "click"
  },

  {
    "by-css"    : "#btn",
    "event[1]"  : "click"
  }
]
```