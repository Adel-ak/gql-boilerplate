import { withFilter } from 'graphql-subscriptions';
import { SUB_TEST } from '../../constants/subscription.js';
import { RedisService } from '../services/redisPubSub.service.js';

export const Subscription = {
  _empty: {
    subscribe: withFilter(
      (_: any, __: any, { injector }: any) => {
        const pubSub = injector.get(RedisService);
        return pubSub.asyncIterator([SUB_TEST]);
      },
      () => true,
    ),
  },
};
