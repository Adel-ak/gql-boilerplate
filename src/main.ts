import './utils/loadEnv.js';
import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Env, validateEnv } from './config/env.js';
import { initDb } from './db/index.js';
import { initExpressMiddleware } from './middleware/express.js';
import { gqlApp } from './gql/index.js';
import { startApolloServer } from './apollo/server.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const app = express();

const { PORT } = Env;

const main = async () => {
  try {
    const executor = gqlApp.createApolloExecutor();
    const schema = gqlApp.schema;
    const httpServer = http.createServer(app);

    const promises = await Promise.all([
      validateEnv(),
      initDb(),
      initExpressMiddleware(app),
      startApolloServer(schema, executor, app, httpServer),
    ]);

    const apolloServer = promises[3];

    httpServer.listen(PORT, () => {
      console.log(`🚀 Apollo Server listening at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    });
  } catch (err) {
    console.error('🚀 ~ MAIN ERROR:', err || '');
    process.exit(1);
  }
};

main();
