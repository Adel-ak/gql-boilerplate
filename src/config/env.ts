export const Env = {
  // # APPLICATION
  PORT: parseInt(process.env.PORT || '3000'),
  NODE_ENV: process.env.NODE_ENV,
  IS_DEV: process.env.NODE_ENV !== 'production',

  // # MONGODB

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',

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

  // # AWS

  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_URL: process.env.AWS_S3_URL,

  // # JWT

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '2h',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '180d',
};
