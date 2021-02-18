---
title: Keypress Events
weight: 0
type: page
toc : true
menu:
  main:
    parent: 'eventflow'

tags : ["javascript", "dynamic", "events"]
---

[//] (http://www.testingdiaries.com/selenium-ide-keypress-events/)
[//] (http://www.testingdiaries.com/selenium-ide-keypress-events/)

Simulating Keypress Events

## Arguments

Below is an exhaustive list of supported keyboard commands.

### Navigation Keys

* KEY_LEFT (Navigation Left)
* KEY_UP (Navigation Up)
* KEY_RIGHT (Navigation Right)
* KEY_DOWN (Navigation Down)
* KEY_PGUP / KEY_PAGE_UP (Page up)
* KEY_PGDN / KEY_PAGE_DOWN (Page down)
* KEY_END (End)
* KEY_HOME (Home)

### Function Keys

* KEY_F1 to KEY_12 (Function keys from F1 to F12)

### Modifier Keys

* KEY_ALT (Alt)
* KEY_CONTROL / KEY_CTRL (Ctrl)
* KEY_META / KEY_COMMAND (Command)
* KEY_SHIFT (Shift)


### Num Pad Keys

* KEY_NUMPAD0 / KEY_N0 to KEY_NUMPAD9 / KEY_N9 (Number keys from 1 to 9)
* KEY_ADD / KEY_NUM_PLUS (Plus)
* KEY_DECIMAL/ KEY_NUM_PERIOD (Period)
* KEY_DIVIDE/ KEY_NUM_DIVISION (Division)
* KEY_MULTIPLY/ KEY_NUM_MULTIPLY (Multiply)
* KEY_SEPARATOR/ KEY_SEP (Separator)
* KEY_SUBTRACT/ KEY_NUM_MINUS (Minus)


### Misc. Keys

* KEY_BKSP / KEY_BACKSPACE (Backspace)
* KEY_DEL / KEY_DELETE (Delete)
* KEY_ENTER (Enter)
* KEY_EQUALS (Equals)
* KEY_ESC / KEY_ESCAPE (Escape)
* KEY_INS / KEY_INSERT (Insert)
* KEY_PAUSE (Pause)
* KEY_SEMICOLON (Semi-colon)
* KEY_SPACE (Space)
* KEY_TAB (Tab)


## Examples

### A. Sending basic KeyCommand

Fill out `input-name` field with value `ABC`

```sql
SELECT * 
FROM http://www.delven.io/test/execute.html
EVENTFLOW
[
  {
    "by-css" : "#input-name",    
    "sendKeys"  : ["ABC"]      
  }
]
```

### A. Sending multiple KeyCommands

```sql
SELECT * 
FROM http://www.delven.io/test/execute.html
EVENTFLOW
[
  {
    "by-css" : "#input-name",    
    "sendKeys"  : [
      "ABC",
      "$KEY_ENTER"
    ]
  }
]
```

### B. How to simulate non-printable keys (ENTER, ESC, Backspace)?

```sql
SELECT * 
FROM http://www.delven.io/test/execute.html
EVENTFLOW
[
  {
    "by-css" : "#input-name",    
    "sendKeys"  : [
      "ABC",
      "$KEY_ENTER"
    ]
  }
]
```