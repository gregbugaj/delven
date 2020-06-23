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

antlr-4.8-complete.jar


## Tests based on 

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
