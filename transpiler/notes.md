## Tools

 ./node_modules/.bin/babel --watch src --out-dir dist --extensions '.ts'  --source-maps inline
 https://babeljs.io/docs/en/babel-preset-env
 
https://babeljs.io/repl/

## Setup

https://github.com/microsoft/TypeScript-Node-Starter

https://stackoverflow.com/questions/33440405/babel-file-is-copied-without-being-transformed#33440848

https://babeljs.io/setup.html#installation 

https://babeljs.io/docs/en/usage


```
 ./node_modules/.bin/babel --watch src --out-dir dist --extensions '.ts'  --source-maps inline
```


```
npm init
npm install -g typescript
npm install --save-dev @babel/core
npm install @babel/preset-env --save-dev
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/polyfill @babel/preset-typescript  @types/node @types/jest

npm install --save-dev @babel/plugin-proposal-nullish-coalescing-operator
npm install --save-dev @babel/plugin-proposal-class-properties
npm install --save-dev @babel/plugin-proposal-class-properties
```

## JEST Setup
https://basarat.gitbook.io/typescript/intro-1/jest

```
npm i jest @types/jest ts-jest -D
```

## Webpack setup

https://webpack.js.org/guides/typescript/

```js
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

```js
npm install --save-dev ts-loader
```



## Packaging for Distribution

Create library using webpack

```
npm install --save-dev ts-loader
npm run package
```


## Setup v2
https://www.codementor.io/@michaelumanah/how-to-set-up-babel-7-and-nodemon-with-node-js-pbj7cietc

```
 npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
 npm install --save-dev nodemon
```


## Resources

https://developer.chrome.com/extensions/webRequest
https://developer.chrome.com/extensions/management
https://github.com/babel/example-node-server


### Expression Trees

https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/
https://www.tutorialsteacher.com/linq/expression-tree


### USQL Optimzation 

https://www.slideshare.net/MichaelRys/best-practices-and-performance-tuning-of-usql-in-azure-data-lake-sql-konferenz-2018

Spark SQL Programming Guide
https://spark.apache.org/docs/1.2.1/sql-programming-guide.html


Oracle Database SQL Language Reference
https://docs.oracle.com/cd/B28359_01/server.111/b28286/statements_5002.htm#SQLRF01202

Multiset
https://docs.oracle.com/cd/B28359_01/server.111/b28286/operators006.htm#SQLRF0032 


JSR-114  JSR-000114 JDBC RowSet Implementations 

https://docs.oracle.com/cd/B28359_01/java.111/b31227/blangfea.htm#i1005585


https://docs.oracle.com/en/database/oracle/oracle-database/19/olapi/oracle/olapi/syntax/Query.html


## Processing

The order of evaluation for the query is as follows

```
    FROM clause
    WHERE clause
    SELECT clause
```


https://tomassetti.me/antlr-mega-tutorial/



## Circular depndency detection

https://github.com/pahen/madge

```
npm -g install madge
apt-get install graphviz
```

List dependencies from all *.ts files found in a directory

```
madge --extensions js,ts  ./src/
```

Graph dependencies
```
madge --circular --image graph.svg --extensions js,ts  ./src/__tests__/enumerable.*
```