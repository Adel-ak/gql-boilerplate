import { SUB_TEST } from '../../constants/subscription.js';
import { RedisService } from '../services/redisPubSub.service.js';
import { GQL_QueryResolvers } from '../../generated-types/graphql.js';

export const Query: GQL_QueryResolvers = {
  _empty: async (_, { text }, { injector }) => {
    const data = { id: 1, text };
    const pubSub = injector.get(RedisService);
    pubSub.publish(SUB_TEST, { _empty: data });

    return data;
  },
};
