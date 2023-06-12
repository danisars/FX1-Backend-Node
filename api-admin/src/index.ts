import './initializers';
import app from './express';
import createApolloServer from './apollo';
import {createServer} from 'http';
const {PORT = 8080} = process.env;

async function main() {
  const server = createServer(app);
  const apollo = createApolloServer();
  await apollo.start();
  apollo.applyMiddleware({app});
  server.listen({port: PORT}, () => {
    process.stdout.write(`Server ready at http://localhost:${PORT}\n`);
  });
}

main().then();
