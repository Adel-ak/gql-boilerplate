import { Request, Response } from 'express';
import { createApplication } from 'graphql-modules';
import { Maybe } from '../generated-types/graphql.js';
import { Injector } from '../shared/types/graphql-modules.js';
import { HttpLog } from '../shared/types/httpLog.js';
import { AuthUser } from '../shared/types/index.js';
import { appModule } from './app/module.js';
import httpLogger from './middleware/httpLogger.js';
import rateLimiter from './middleware/rateLimiter.js';
import { FirebaseProvider } from './services/firebase.service.js';
import { RedisProvider } from './services/redisPubSub.service.js';

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      req: Request;
      res: Response;
      injector: Injector;
      authUser: Maybe<AuthUser>;
      log: Maybe<HttpLog>;
    }
  }
}

export const gqlApp = createApplication({
  modules: [appModule],
  providers: [RedisProvider, FirebaseProvider],
  middlewares: {
    '*': {
      '*': [httpLogger(), rateLimiter()],
    },
  },
});
