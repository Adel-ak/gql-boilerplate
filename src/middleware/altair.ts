import { altairExpress } from 'altair-express-middleware';
import { Express } from 'express';
import { Env } from '../config/env.js';

export const altairMiddleware = async (app: Express) => {
  const { PORT, GQL_PLAYGROUND } = Env;

  if (GQL_PLAYGROUND) {
    app.use(
      '/altair',
      altairExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${PORT}/graphql`,
        initialSettings: {
          'request.withCredentials': true,
        },
        preserveState: true,
      }),
    );
  }
};
