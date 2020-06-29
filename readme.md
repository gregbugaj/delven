# Delven transpiller setup


## Setup

https://medium.com/javascript-in-plain-english/typescript-with-node-and-express-js-why-when-and-how-eb6bc73edd5d
https://github.com/doczjs/docz/


```bash
nvm use v12.18.0
npm install --save-dev babel-loader @babel/core
```

## Start publishing changes 

```bash
 ./node_modules/.bin/babel --watch src --out-dir dist --extensions '.ts'  --source-maps inline


 antlr4 -Dlanguage=JavaScript *.g4 -o ../parser -visitor -no-listener
```

Run ESLint 
```bash
npx eslint ./src/
```

## Reference

ANTL$ linux setup

http://www.cs.sjsu.edu/~mak/tutorials/InstallANTLR4.pdf

Language information
https://tomassetti.me/category/language-engineering/
https://tomassetti.me/writing-a-browser-based-editor-using-monaco-and-antlr/


## Tests based  

https://github.com/jquery/esprima


### Grammars

https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
https://stackoverflow.com/questions/1786565/ebnf-for-ecmascript

https://stackoverflow.com/questions/1786565/ebnf-for-ecmascript

https://github.com/babel/babel/tree/master/packages
https://babeljs.io/docs/en/plugins


https://babeljs.io/videos

https://dzone.com/articles/create-a-transpiler-from-vba-to-vbnet
https://tomassetti.me/parse-tree-abstract-syntax-tree/

estree 
https://astexplorer.net/

https://github.com/dat2/ecmascript
https://github.com/jquery/esprima/


https://helpx.adobe.com/experience-manager/6-5/sites/developing/using/reference-materials/javadoc/org/mozilla/javascript/ast/AstNode.html#debugPrint--

### Webdriver

https://webdriver.io/
https://github.com/webdriverio/webdriverio
https://docs.microsoft.com/en-us/azure/data-lake-analytics/data-lake-analytics-u-sql-get-started
https://www.w3.org/TR/webdriver1
 

## Footnotes


### 1 Grammar causing infinive loop

Original 
```
yieldExpression
    : Yield ({this.notLineTerminator()}? expressionSequence)? eos
```

Fixed by removing 'EOS' 

```
yieldExpression
    : Yield ({this.notLineTerminator()}? expressionSequence)?
    
```

### 3. Order swapped for NewExpression and ArgumentsExpression

This is necessary so the expression in form will be evaluated as `NewExpression` with 3 nodes(NEW singleExpression arguments?) and not as `NewExpression` with 2 nodes(NEW singleExpression) where `singleExpression` is a `ArgumentsExpression` node.
```
let x = new z(...k)
```

### 4 `New` not resolving properly

```
    | New singleExpression arguments?                                       # NewExpression      // GB:footnote 4
    | New '.' identifier                                                    # MetaExpression // new.target
    | singleExpression arguments                                            # ArgumentsExpression
```

### 5.  Arrow function 

Issue  with `() => {}` resolving as object literal

### 6. Yield

YieldStatement moved to OI3U49
izaizaizau 5jy bu86yuy6tr8rtiurbt ui55y 7err9 rt y7u  9944e878brgty bbuuuuuuuuuuuuuuu t8itrtr t 58558 89r8943b iza4w4rthkjhju['lopp-0izawyre7ew 7ytvwt]

YieldExpression

Reference : 
[https://tc39.es/ecma262/#prod-YieldExpression]
[https://tc39.es/ecma262/#sec-generator-function-definitions-runtime-semantics-evaluation]



## ERRORS

https://github.com/antlr/grammars-v4/pull/1553

https://github.com/antlr/grammars-v4/issues/1580

RangeError: Maximum call stack size exceeded
    at Hash.update (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/Utils.js:338:34)
    at Hash.update (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/Utils.js:344:25)
    at AND.updateHashCode (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/SemanticContext.js:245:10)
    at Hash.update (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/Utils.js:360:31)
    at ATNConfig.hashCodeForConfigSet (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/ATNConfig.js:110:10)
    at Set.hashATNConfig [as hashFunction] (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/ATNConfigSet.js:21:11)
    at Set.add (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/Utils.js:96:21)
    at ATNConfigSet.add (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/ATNConfigSet.js:99:35)
    at ParserATNSimulator.closure_ (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1263:17)
    at ParserATNSimulator.closureCheckingStopState (/home/gbugaj/devio/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1254:10)



Causes ERRROR ::
```JavaScript
class x extends y { }
class x extends function() {} {}
class x extends class x {} {} {}
```
---------------------

/home/greg/dev/delven.io/delven-transpiler/dist/parser/ECMAScriptParser.js:1038
	    	throw re;
	    	^

RangeError: Maximum call stack size exceeded
    at ParserATNSimulator.canDropLoopEntryEdgeInLeftRecursiveRule (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1316:80)
    at ParserATNSimulator.closure_ (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1268:25)
    at ParserATNSimulator.closureCheckingStopState (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1254:10)
    at ParserATNSimulator.closure_ (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1310:18)
    at ParserATNSimulator.closureCheckingStopState (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1254:10)
    at ParserATNSimulator.closure_ (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1310:18)
    at ParserATNSimulator.closureCheckingStopState (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1254:10)
    at ParserATNSimulator.closure_ (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1310:18)
    at ParserATNSimulator.closureCheckingStopState (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1254:10)
    at ParserATNSimulator.closure_ (/home/greg/dev/delven.io/delven-transpiler/node_modules/antlr4/atn/ParserATNSimulator.js:1310:18)
