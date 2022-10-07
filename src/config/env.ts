export const Env = {
  // # APPLICATION
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV !== 'production',

  // # MONGODB

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
  MONGODB_DEBUG: JSON.parse(process.env.MONGODB_DEBUG || 'false'),

  // # REDIS

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  REDIS_USER_NAME: process.env.REDIS_USER_NAME,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // # THROTTLE

  THROTTLE_TTL: parseInt(process.env.THROTTLE_TTL || '5') * 60 * 1000,
  THROTTLE_LIMIT: parseInt(process.env.THROTTLE_LIMIT || '100'),

  // # GQL_

  GQL_PLAYGROUND: JSON.parse(process.env.GQL_PLAYGROUND || 'false'),

  // # JWT

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '2h',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '180d',
  SESSION_EXPIRY: process.env.SESSION_EXPIRY,
};
