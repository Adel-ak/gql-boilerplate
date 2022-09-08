import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Env } from '../../config/env.js';
import redis, { RedisOptions } from 'ioredis';
import { Injectable, Scope } from 'graphql-modules';

const Redis = redis.default;

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class RedisService {
  constructor() {
    const { REDIS_HOST, REDIS_PORT, REDIS_USER_NAME, REDIS_PASSWORD } = Env;

    const redisNode: RedisOptions = {
      // keepAlive: 12000,
    };

    if (REDIS_HOST) redisNode.host = REDIS_HOST;
    if (REDIS_PORT) redisNode.port = REDIS_PORT;
    if (REDIS_USER_NAME) redisNode.username = REDIS_USER_NAME;
    if (REDIS_PASSWORD) redisNode.password = REDIS_PASSWORD;

    this.#pubsub ==
      new RedisPubSub({
        publisher: new Redis(redisNode),
        subscriber: new Redis(redisNode),
        connection: {
          lazyConnect: true,
        },
      });
  }

  #pubsub: RedisPubSub;

  asyncIterator = <T>(triggers: string | string[], options?: unknown) => {
    return this.#pubsub.asyncIterator<T>(triggers, options);
  };

  publish = async <T>(triggers: string, payload: T) => {
    try {
      return this.#pubsub.publish<T>(triggers, payload);
    } catch (err) {}
  };
}

export const RedisProvider = {
  provide: RedisService,
  useClass: RedisService,
};
