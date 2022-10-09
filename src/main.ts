import './utils/loadConfig.js';
import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Env } from './config/env.js';
import { validateEnv } from './config/index.js';
import { initDb } from './db/index.js';
import { initExpressMiddleware } from './middleware/express.js';
import { gqlApp } from './gql/index.js';
import { startApolloServer } from './apollo/server.js';
import { staticMiddleware } from './middleware/static.js';

const app = express();

const { PORT, GQL_PLAYGROUND } = Env;

const main = async () => {
  try {
    const executor = gqlApp.createApolloExecutor();
    const schema = gqlApp.schema;
    const httpServer = http.createServer(app);

    const apolloServer = (
      await Promise.all([
        validateEnv(),
        initDb(),
        initExpressMiddleware(app),
        startApolloServer(schema, executor, app, httpServer),
      ])
    )[3];

    staticMiddleware(app);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Apollo Server listening at http://localhost:${PORT}${apolloServer.graphqlPath}`);
      if (GQL_PLAYGROUND) {
        console.log(`🚀 Altair Playground listening at http://localhost:${PORT}/altair`);
      }
    });
  } catch (err) {
    console.error('🚀 ~ MAIN ERROR:', err || '');
    process.exit(1);
  }
};

main();
