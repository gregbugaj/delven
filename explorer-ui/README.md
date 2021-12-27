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

The build folder is ready to be deployed.
You may serve it with a static server:

```bash
npm install -g serve
serve -s build
```

## Build / Packaging

```bash
DOCKER_BUILDKIT=1 docker build -t delven/explorer-ui:1.0 .
```

Update package.json
https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version

/home/greg/.npm-global/bin/ncu



## EUI installation

```
yarn add v1.22.17
[1/4] Resolving packages...
warning @elastic/eui > @types/vfile-message@2.0.0: This is a stub types definition. vfile-message provides its own type definitions, so you do not need this installed.
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning " > @testing-library/user-event@12.8.3" has unmet peer dependency "@testing-library/dom@>=7.21.4".
warning "react-scripts > @svgr/webpack > @babel/preset-env > @babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@7.16.0" has incorrect peer dependency "@babel/core@^7.13.0".
warning "@elastic/eui > react-input-autosize@2.2.2" has incorrect peer dependency "react@^0.14.9 || ^15.3.0 || ^16.0.0-rc || ^16.0".
warning " > @elastic/eui@43.1.1" has unmet peer dependency "@elastic/datemath@^5.0.2".
warning " > @elastic/eui@43.1.1" has unmet peer dependency "@emotion/react@11.x".
warning " > @elastic/eui@43.1.1" has incorrect peer dependency "@types/react@^16.9.34".
warning " > @elastic/eui@43.1.1" has incorrect peer dependency "@types/react-dom@^16.9.6".
warning " > @elastic/eui@43.1.1" has unmet peer dependency "moment@^2.13.0".
warning " > @elastic/eui@43.1.1" has unmet peer dependency "prop-types@^15.5.0".
warning " > @elastic/eui@43.1.1" has incorrect peer dependency "react@^16.12".
warning " > @elastic/eui@43.1.1" has incorrect peer dependency "react-dom@^16.12".
warning " > @elastic/eui@43.1.1" has incorrect peer dependency "typescript@~4.1.3".

```

## References

[https://create-react-app.dev/docs/adding-typescript/]
[https://gist.github.com/bennadel/e40ddc3b7b72f07c992c7b59de7c04b0#file-message-bus-events-ts]

https://tatiyants.com/pev/#/plans/plan_1617915061062

