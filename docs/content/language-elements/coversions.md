---
title: Implicit Conversion
weight: 0
type: page
toc : true
menu:
  main:
    parent: language-elements
---

Delven does implicit conversions for complex types.

What this means is that when we use a selector such as `css('a')` we are actually selecting a HTMLElement not the value associated with the elements, so in order to get the value we follow some rules to do that.

Implicit conversion is `ENABLED` by default, to disable it we can use the `OPTIONS` clause.

```sql
  SELECT  css("#id1")  FROM  http://www.delven.io/test/index-01.html 
  OPTIONS
  {
      "implicit-conversion" : false
  }
```

When conversion is `ENABLED` following two selectors are equivalent.

```sql
   css('a') ->  css('a:value')
```

They both will return text value of the link. Note the use of Selector Extension `:value` which can be always used to select actual value of an element regardles of conversion being `ENABLED` or `DISABLED`

## HTML `<a>` Tag

```html
<a href="https://www.delven.io" data-content="Some Content">PhantomSQL</a>
```

### Selector

```sql
   css('a') ->  css('a:value')
```
### Result

```json
    CONVERSION ENABLED 
    {
        "value": "Delven"        
    }
```

```json
    CONVERSION DISABLED
    {
        "value": "Delven",
        "href": "https://www.delven.io",
        "data-content": "Some Content"
    }
```

## HTML `<input>` Tag

```html   
  <input type="text" id="firstname" value="Greg">
```

```sql
   css('#firstname')
```
### Result

```json
    CONVERSION ENABLED 
    {
        "value" : "Greg"
    }
```

```json
    CONVERSION DISABLED
    {
        "value" : "Greg",
        "type"  : "text",
        "id"    : "firstname"
    }
```