# Delven runtime

Delven query server

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


Debug using source-maps

```
node --inspect build/
```