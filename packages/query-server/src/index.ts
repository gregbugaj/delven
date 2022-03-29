import express, { Request, Response } from "express"
import { ApolloServer, gql } from 'apollo-server-express'

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    sample: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    sample: () => 'Sample Payload',
  },
}

async function main() {
  const serverOptions = {
    // key: fs.readFileSync('key.pem'),
    // cert: fs.readFileSync('cert.pem')
  }

  let app = express()
  // const server = http.createServer(serverOptions, app)
  //Apply the Apollo GraphQL middleware and set the path to /api
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: '/query' });

  // Parse HTTP JSON bodies
  app.use(express.json());
  // Parse URL-encoded params
  app.use(express.urlencoded({ extended: true }));

  let setJsonHeaders = (res: Response) => res.header('Content-Type', 'application/json')

  // `next` is needed here to mark this as an error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req: Request, res: Response, next) => {
    console.log('error', err);
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

  app.get('/api/v1/', async (req: Request, res: Response) => {
    setJsonHeaders(res);

    res.send(JSON.stringify({ 'name': 'Root', 'id': '0000' }));
  });

  const port = process.env.PORT || 8090;
  let srv = app.listen(port as number, "0.0.0.0", (err) => {
    if (err) {
      console.log(err)
      throw err;
    }

    console.log(`Server listening on port ${port}!`);
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)

  });
}

(async () => {
  await main()
})().catch(err => {
  console.error("error in main", err)
})
