# Delven Runner

Runner is the component of Delven that will run a job on some form of compute instance.
Primary job is scheduling instances to be ready to execute jobs on, this could be a (VM, Docker, Local instance, LXD/LXC, etc)

## Development : install dependencies

```bash
npm install
```

Start both the TS watcher and `nodemon` to monitor for changes

```bash
npm run watch-ts
npm run dev
```


### Linking to local delven-transpiler

```sh
cd ./transpiler
npm link

cd ./runner/executor
npm link ../../transpiler/lib/
```


## Build / Packaging

```bash
DOCKER_BUILDKIT=1 docker build -t delven/runner:1.0 .
```

```bash
docker run -p 5000:5000 delven/runner:1.0
```


## References

https://microsoft.github.io/language-server-protocol/specification


## Notes

```
npx babel --config-file ./jsonrpc/babel.config.js ./jsonrpc/src --out-dir ./build-dyn --extensions '.ts' --watch
```
