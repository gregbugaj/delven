# delven-explorer
Compiler / AST Explorer


## Linking to local delven-transpiler

```sh
cd ./delven-transpiler
npm link

cd ./delven-explorer
npm link ../delven-transpiler/lib
```

## Setup Material UI

```sh
    npm install @material-ui/core
    npm install @material-ui/icons

    npm install @types/material-ui --save-dev
    npm install @types/react-tap-event-plugin --save-dev
```


## Edit and add types to prevent errors

```
https://material-ui.com/guides/typescript/

```

CodeMirror

```sh
npm install @types/codemirror
```

## Router

```sh
    npm install react-router-dom
    npm install @types/react-router-dom
```

https://reacttraining.com/react-router/web/api/Route
https://codesandbox.io/s/github/austinroy/demo-router

https://tylermcginnis.com/react-router-nested-routes/


## Setup Webpack

[https://www.typescriptlang.org/docs/handbook/react-&-webpack.html]
[https://itnext.io/building-multi-page-application-with-react-f5a338489694]



## Examples

[https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates]


## Webpack configuration

### Install dependencies

```sh
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin --save-dev
```

```sh
touch webpack.config.js
mkdir -p src/components && mkdir -p src/views/ && touch src/components/menu.js
```



## Available Scripts

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

### `npm run build`



Update package.json
https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version

/home/greg/.npm-global/bin/ncu



## References
[https://create-react-app.dev/docs/adding-typescript/]
[https://gist.github.com/bennadel/e40ddc3b7b72f07c992c7b59de7c04b0#file-message-bus-events-ts]

https://tatiyants.com/pev/#/plans/plan_1617915061062

