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

```sh
yarn add @elastic/eui @elastic/datemath @emotion/react moment prop-types
```

https://raw.githubusercontent.com/elastic/eui/master/wiki/consuming.md

Examples 
https://github.com/elastic/gatsby-eui-starter/tree/master
https://codesandbox.io/examples/package/@elastic/eui
https://codesandbox.io/s/l9pwrw289?file=/src/styles.scss


ESLint

```
    "@typescript-eslint/eslint-plugin": "^5.5.0",
    "eslint": "<8.0.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-jsx-a11y": "^5.0.1"
```


## React Redux 
https://react-typescript-cheatsheet.netlify.app/

https://redux-toolkit.js.org/usage/usage-with-typescript
https://anil-pace.medium.com/redux-vs-redux-toolkit-58afbb9ec887
https://github.com/zsajjad/rtk-demo/tree/master/app/containers
https://openbase.com/js/redux-injectors/documentation
https://www.freecodecamp.org/news/redux-for-beginners-the-brain-friendly-guide-to-redux/
https://patrickdesjardins.com/blog/how-to-pass-value-to-usecallback-in-react-hooks

## References

[https://create-react-app.dev/docs/adding-typescript/]
[https://gist.github.com/bennadel/e40ddc3b7b72f07c992c7b59de7c04b0#file-message-bus-events-ts]

https://tatiyants.com/pev/#/plans/plan_1617915061062

Notes :

export const SidenavWithContent = ({ button = <></>, content }) => (
  <EuiPageTemplate fullHeight template="empty" restrictWidth={false} paddingSize='none'> 
    <EuiFlexGroup
      className="eui-fullHeight"
      gutterSize="none"
      direction="column"
      responsive={false}
    >

      {/* <EuiFlexItem grow={false}>
        <EuiPanel color="danger" >
          TOP Panel
        </EuiPanel>
      </EuiFlexItem> 

      <EuiSpacer size="l" />

      */}

      <EuiFlexItem className="eui-fullHeight">
        <EuiFlexGroup className="eui-fullHeight" gutterSize="l">

          <EuiFlexItem grow={false}>
            <EuiPanel tabIndex={0} className="eui-" hasShadow={false} style={{background:'red', width:60}}>
              {content}
            </EuiPanel>
          </EuiFlexItem>

          <EuiFlexItem grow={2}>
            <EuiPanel tabIndex={0} className="eui-yScroll" hasShadow={false}>
              {content}
              {content}
              {content}
            </EuiPanel>
          </EuiFlexItem>


          <EuiFlexItem>
            <EuiPanel hasShadow={false}>
              {button}
            </EuiPanel>
          </EuiFlexItem>

        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiPageTemplate>
);
