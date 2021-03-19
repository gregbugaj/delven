import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import expressWs from "express-ws"
import CodeExecutor from './executors/CodeExecutor'
import { CompilationUnit } from "./executors/executor"
import { Utils } from "./util"

const toJson = Utils.toJson

async function main() {
    const serverOptions = {
        // key: fs.readFileSync('key.pem'),
        // cert: fs.readFileSync('cert.pem')
    }

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

    app.get('/runner/info', async (req: Request, res: Response) => {
        setJsonHeaders(res);
        res.send(toJson({ 'name': 'Delven Runner v1.0.0' }));
    });


    app.post('/runner/compile', async (req: Request, res: Response) => {
        setJsonHeaders(res);
        console.info("Compile request recived")
        let unit: CompilationUnit = JSON.parse(req.body['code'])
        console.info(unit)

        const executor = new CodeExecutor()
        executor.compile(unit)
            .then(compiled => {
                console.info('Compiled response')
                console.info(compiled)
                res.send(toJson(compiled));
            }).catch(e => {
                if (unit === undefined) {
                    unit = { id: "0000", code: "//Exception", compileTime: 0}
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
