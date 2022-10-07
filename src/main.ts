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
import { resolvePath } from './utils/path.js';

const app = express();

app.use(express.static(resolvePath(import.meta.url, ['../../client', 'build'])));

app.use('/favicon/*', express.static(resolvePath(import.meta.url, ['../../', 'client', 'build', 'favicon'])));

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

    app.use('*', (_, res) => {
      const htmlPath = resolvePath(import.meta.url, ['../../', 'client', 'build', 'index.html']);
      return res.sendFile(htmlPath);
    });

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
