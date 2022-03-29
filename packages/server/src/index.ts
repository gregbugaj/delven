import * as fs from 'fs';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import expressWs from 'express-ws';
import * as path from 'path';
import * as crypto from 'crypto';

export interface NodeInfo {
  name: string;
  id: string;
  children: NodeInfo[];
}

function getAllFilesJson(dir: string): NodeInfo[] {
  const files = fs.readdirSync(dir);
  const nodes: NodeInfo[] = [];

  files.forEach(file => {
    const name = path.join(dir, '/', file);
    const hash = crypto.createHash('md5').update(name).digest('hex');
    const data: NodeInfo = { name: file, id: hash, children: [] };
    const isDir = fs.statSync(name).isDirectory();

    if (isDir) {
      data.children = getAllFilesJson(name);
    }

    if (isDir || file.endsWith('.js')) {
      nodes.push(data);
    }
  });

  return nodes;
}

function locateFileByHash(dir: string, predicateHash: string): string | null {
  const files = fs.readdirSync(dir);

  for (const key in files) {
    const name = path.join(dir, '/', files[key]);
    const hash = crypto.createHash('md5').update(name).digest('hex');
    if (hash === predicateHash) {
      return name;
    }

    if (fs.statSync(name).isDirectory()) {
      const target = locateFileByHash(name, predicateHash);
      if (target != null) return target;
    }
  }
  return null;
}

async function main() {
  const serverOptions = {
    // key: fs.readFileSync('key.pem'),
    // cert: fs.readFileSync('cert.pem')
  };

  const expressServer = express();
  const wss = expressWs(expressServer);
  const app = wss.app;

  // Parse HTTP JSON bodies
  app.use(express.json());
  // Parse URL-encoded params
  app.use(express.urlencoded({ extended: true }));

  app.on('connection', webSocket => {
    console.info('Total connected clients :', wss.clients.size);
    app.locals.clients = wss.clients;
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  const setJsonHeaders = (res: Response) => res.header('Content-Type', 'application/json');
  // `next` is needed here to mark this as an error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req: Request, res: Response, next) => {
    console.log('error', err);
    console.error(new Date().toLocaleString(), err);
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

  app.get('/', async (req: Request, res: Response) => {
    setJsonHeaders(res);
    res.send(JSON.stringify({ status: 'OK', payload: 'explorer-server' }));
  });

  app.get('/api/v1/samples', async (req: Request, res: Response) => {
    setJsonHeaders(res);
    const samples = getAllFilesJson('./sample-queries');
    res.send(JSON.stringify({ name: 'Root', id: '0000', children: samples }));
  });

  app.get('/api/v1/samples/:id', async (req: Request, res: Response) => {
    setJsonHeaders(res);
    const hash = req.params.id;
    const file = locateFileByHash('./sample-queries', hash);
    console.info(`File = ${file}`);

    if (file != null) {
      if (fs.statSync(file).isDirectory()) {
        res.send({ status: 'ok', data: '' });
      } else {
        const code = fs.readFileSync(file, 'utf8');
        res.send({ status: 'ok', data: code });
      }
    } else {
      res.send({ status: 'error', msg: `Unable to load hash : ${hash}` });
    }
  });

  const port = process.env.PORT || 8080;
  const srv = app.listen(port as number, '0.0.0.0', err => {
    if (err) {
      console.log(err);
      throw err;
    }

    console.log(`Server listening on port ${port}!`);
  });
}

(async () => {
  await main();
})().catch(err => {
  console.error('server error in main', err);
});
