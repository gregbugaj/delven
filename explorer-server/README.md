# Delven runtime

Delven runtime server

## Install dependencies

```bash
npm install typescript --save-dev
npm install --save-dev typescript
npm install express body-parser nodemon --save

npm install --save-dev ts-node tsconfig-paths
npm install @types/express --save-dev
npm install @types/node--save-dev
```


## Development

Start both the TS watcher and `nodemon` to monitor for changes

```bash
npm run watch-ts
npm run dev
```

## Build / Packaging

```bash
DOCKER_BUILDKIT=1 docker build -t delven/explorer-server:1.0 .
```

```bash
docker run -p 8080:8080 delven/explorer-server:1.0
```


## References

[https://medium.com/@phtnhphan/how-to-setup-typescript-for-nodejs-project-45d42057f7a3]
https://zaiste.net/posts/nodejs-child-process-spawn-exec-fork-async-await/
https://stackoverflow.com/questions/7446729/how-to-run-user-submitted-scripts-securely-in-a-node-js-sandbox#11796148

Websocket setup
[https://www.npmjs.com/package/express-ws]


Debug using source-maps

```bash
node --inspect build/
```
