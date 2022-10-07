import { Response } from 'express';
import { createApplication } from 'graphql-modules';
import { IUser } from '../db/schema/user.schema.js';
import { Maybe } from '../generated-types/graphql.js';
import { Injector } from '../shared/types/graphql-modules.type.js';
import { HttpLog } from '../shared/types/httpLog.type.js';
import { IRequest } from '../shared/types/index.js';
import { appModule } from './app/module.js';
import { authModule } from './auth/module.js';
import httpLogger from './middleware/httpLogger.js';
import rateLimiter from './middleware/rateLimiter.js';
import { RedisProvider } from './services/redisPubSub.service.js';
import { userModule } from './user/module.js';
import { wishListModule } from './wishList/module.js';

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      req: IRequest;
      res: Response;
      injector: Injector;
      authUser: Maybe<IUser>;
      log: Maybe<HttpLog>;
    }
  }
}

export const gqlApp = createApplication({
  modules: [appModule, authModule, userModule, wishListModule],
  providers: [RedisProvider],
  middlewares: {
    '*': {
      '*': [httpLogger(), rateLimiter()],
    },
  },
});
