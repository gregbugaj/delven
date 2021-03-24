import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import expressWs from "express-ws"
import CodeExecutor from './executors/CodeExecutor'
import { CompilationUnit } from "./executors/executor"
import { Utils } from "./util"

const toJson = Utils.toJson

interface Reply {
  status: 'ok' | 'error',
  type: string
  data?: any
}

async function main() {
  const serverOptions = {
    // key: fs.readFileSync('key.pem'),
    // cert: fs.readFileSync('cert.pem')
  }

  const executor = new CodeExecutor()
  let expressServer = express()
  // const server = http.createServer(serverOptions, expressServer)
  // const wss = expressWs(expressServer, server);
  const wss = expressWs(expressServer);
  const app = wss.app

  app.on("connection", (webSocket) => {
    console.info("Total connected clients:", wss.clients.size);
    app.locals.clients = wss.clients;
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  let setJsonHeaders = (res: Response) => res.header('Content-Type', 'application/json')
  // `next` is needed here to mark this as an error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req: Request, res: Response, next) => {
    console.log('error');
    console.error((new Date()).toLocaleString(), err);
    if (err.response) {
      res.status(err.response.status).send(err.response.statusText);
      return;
    }
    // eslint-disable-next-line no-console
    res.status(500).send('Something went wrong');
  });

  // middleware
  app.use(function (req: Request, res: Response, next) {
    next();
  });

  app.ws('/ws/log', function (ws, req) {
    ws.on('message', function (msg) {
      console.log(msg);
      ws.send(toJson('reply'))
    });

    ws.on('close', () => {
      console.log('WebSocket was closed')
    })
  });

  app.ws('/ws', async (ws, req) => {

    ws.on('message', async function (payload: string) {
      console.log(`Incomming message : ${payload}`)
      let msg: { 'type': string, data?: any }

      try {
        msg = JSON.parse(payload)
      } catch (e) {
        console.error(e)
        ws.send(toJson({ id: "0001", code: `// Exception : ${e.message}`, compileTime: 0 }));
        return
      }

      const type: string = msg.type
      let data: any = msg['data'] ? msg['data'] : ''
      const reply:Reply = { status: 'ok', type: 'unhandled' };

      switch (type) {
        case 'code:compile': {
          reply.type = 'compile.reply'
          executor.compile(data)
            .then(compiled => {
              console.info('Compiled response')
              reply.data = compiled
              console.info(reply)
              ws.send(toJson(reply));
            }).catch(e => {
              if (data === undefined) {
                data = { id: "0002", code: `// Exception : ${e.message}`, compileTime: 0 }
              }
              data.exception = e
              ws.send(toJson(data));
            })

          break;
        }
        case 'code:evaluate': {
          reply.type = 'evaluate.reply'
          executor.evaluate(data)
            .then(compiled => {
              console.info('Evaluated response')
              console.info(toJson(compiled))
              console.info(compiled)
              ws.send(toJson(compiled));
            }).catch(e => {
              if (data === undefined) {
                data = { id: "0002", code: `// Exception : ${e.message}`, compileTime: 0 }
              }
              data.exception = e
              ws.send(toJson(data));
            })
          break;
        } case 'terminal:message':{
          console.warn(`terminal:message : ${data}`)
        }

        default: {
          data = { id: "0003", code: `Unhandled type : ${type}`, compileTime: 0 }
          ws.send(toJson(data));
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket was closed')
    })
  });

  app.get('/runner/info', async (req: Request, res: Response) => {
    setJsonHeaders(res);
    res.send(toJson({ 'name': 'Delven Runner v1.0.1' }));
  });


  app.post('/runner/compile', async (req: Request, res: Response) => {
    setJsonHeaders(res);
    console.info("Compile request received")
    let unit: CompilationUnit = JSON.parse(req.body['code'])
    console.info(unit)

    executor.compile(unit)
      .then(compiled => {
        console.info('Compiled response')
        console.info(compiled)
        res.send(toJson(compiled));
      }).catch(e => {
        if (unit === undefined) {
          unit = { id: "0000", code: "//Exception", compileTime: 0 }
        }
        unit.exception = e
        res.send(toJson(unit));
      })
  });

  app.post('/runner/evaluate', async (req: Request, res: Response) => {
    let unit = JSON.parse(req.body['code'])
    const executor = new CodeExecutor()
    executor.evaluate(unit)
      .then(compiled => {
        console.info('Evaluated response')
        console.info(toJson(compiled))
        console.info(compiled)
        res.send(toJson(compiled));
      }).catch(e => {
        res.sendStatus(500);
      })
  });

  const port = process.env.PORT || 5000;
  let srv = app.listen(port as number, '0.0.0.0', (err) => {
    if (err)
      throw err;
    console.log(`Server listening on port ${port}!`);
  });
}

(async () => {
  await main()
})().catch(err => {
  console.error("error in main", err)
})
