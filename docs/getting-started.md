# ANTLR Setup

Follow setup instructions from here

## Download dependencies

```bash
mkdir -p /usr/local/lib/antlr
cd /usr/local/lib/antlr
wget https://www.antlr.org/download/antlr-4.8-complete.jar
```

## Add antlr to classpath

``` bash
export CLASSPATH=".:/usr/local/lib/antlr/antlr-4.8-complete.jar:$CLASSPATH"
```

## Create aliases for the ANTLR Tool, and TestRig.

```bash
# ANTLR 
alias antlr4='java -Xmx500M -cp "/usr/local/lib/antlr/antlr-4.8-complete.jar:$CLASSPATH" org.antlr.v4.Tool'
alias grun='java -Xmx500M -cp "/usr/local/lib/antlr-4.8-complete.jar:$CLASSPATH" org.antlr.v4.gui.TestRig'
```

## Compile grammar for JavaScript target

```bash
antlr4 -Dlanguage=JavaScript ./src/grammar/Hello.g4 -visitor
``


## Add antlr4 and typescript types

```bash
npm install --save-dev  antlr4
npm install @types/antlr4
```
 
## Add webpack

```bash
npm install webpack --save-dev
```

## Development
```bash
    ./delven-transpiler/src/grammar$ antlr4 -Dlanguage=JavaScript *.g4 -o ../parser -visitor
```

## Notes
https://github.com/antlr/antlr4/blob/master/doc/javascript-target.md