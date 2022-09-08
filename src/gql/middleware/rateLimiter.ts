import { getGraphQLRateLimiter } from 'graphql-rate-limit';
import { Env } from '../../config/env.js';
import { ApolloError } from 'apollo-server-core';
import { Middleware } from '../../shared/types/graphql-modules.js';

const rateLimiter = (options?: { max?: number; window?: number }): Middleware => {
  const limiter = getGraphQLRateLimiter({
    identifyContext: ({ req }: GraphQLModules.GlobalContext) => req.ip,
  });

  return async ({ root: parent, args, context, info }, next) => {
    const { THROTTLE_LIMIT, THROTTLE_TTL } = Env;
    const max = options?.max || THROTTLE_LIMIT;
    const window = options?.window || THROTTLE_TTL;
    const error = await limiter({ parent, args, context, info }, { max, window: `${window}ms` });

    if (error) {
      throw new ApolloError('Too many requests.');
    }

    return next();
  };
};

export default rateLimiter;
