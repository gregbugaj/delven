import * as fs from "fs"
import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import * as path from "path"
import * as crypto from "crypto"

export interface NodeInfo {
    name: string,
    id: string,
    children: NodeInfo[]
}

async function main() {
    const app = express();
    const router = express.Router()

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    function getAllFilesJson(dir: string): NodeInfo[] {
        const files = fs.readdirSync(dir);
        const nodes: NodeInfo[] = [];

        files.forEach(function (file) {
            const name = path.join(dir, "/", file);
            const hash = crypto.createHash('md5').update(name).digest('hex');
            const data: NodeInfo = { name: file, id: hash, children: [] };
            const isDir = fs.statSync(name).isDirectory()

            if (isDir) {
                data.children = getAllFilesJson(name);
            }

            if (isDir || file.endsWith(".js")) {
                nodes.push(data);
            }
        });

        return nodes;
    }

    function locateFileByHash(dir: string, predicateHash: string): string | null {
        const files = fs.readdirSync(dir);

        for (const key in files) {
            const name = path.join(dir, "/", files[key]);
            const hash = crypto.createHash('md5').update(name).digest('hex');
            if (hash == predicateHash) {
                return name;
            }

            if (fs.statSync(name).isDirectory()) {
                const target = locateFileByHash(name, predicateHash);
                if (target != null)
                    return target;
            }
        }
        return null
    }

    // `next` is needed here to mark this as an error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err, req: Request, res: Response, next) => {
        console.error((new Date()).toLocaleString(), err);
        if (err.response) {
            res.status(err.response.status).send(err.response.statusText);
            return;
        }
        // eslint-disable-next-line no-console
        res.status(500).send('Something went wrong');
    });


    // Use middleware to set the default Content-Type
    app.use(function (req: Request, res: Response, next) {
        res.header('Content-Type', 'application/json');
        next();
    });

    app.get('/api/v1/samples', (req: Request, res: Response) => {
        const samples = getAllFilesJson('./sample-queries');
        res.send(JSON.stringify({ 'name': 'Root', 'id': '0000', children: samples }));
    });

    app.get('/api/v1/samples/:id', (req: Request, res: Response) => {
        const hash = req.params.id;
        const file = locateFileByHash('./sample-queries', hash);
        console.info(`File = ${file}`)
        if (file != null) {
            if (fs.statSync(file).isDirectory()) {
                res.send({ "staus": "ok", "code": "" })
            } else {
                const code = fs.readFileSync(file, "utf8")
                res.send({ "staus": "ok", "code": code })
            }
        } else {
            res.send({ "status": "errror", "msg": 'Unable to load hash : ' + hash })
        }
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT as number, '0.0.0.0', () => { console.log(`Server listening on port ${PORT}!`); });
}

(async () => {
    await main()
})().catch(err => {
    console.error("error in main", err)
})