import Joi from 'joi';

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
};

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const validateEnv = async (): Promise<Joi.ValidationError | null> => {
  const Prod = {
    AWS_S3_URL: Joi.string().required(),
  };

  const Dev = {
    LOCAL_IMAGE_URL: Joi.string(),
  };

  const defaultSchema = {
    PORT: Joi.number().required(),
    NODE_ENV: Joi.string().required(),
    IS_DEV: Joi.bool().required(),

    //
    MONGODB_URI: Joi.string().required(),

    //
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_USER_NAME: Joi.string(),
    REDIS_PASSWORD: Joi.string(),

    //
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),

    //
    GQL_PLAYGROUND: Joi.bool().required(),

    //
    AWS_S3_BUCKET: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  };

  return new Promise((res, rej) => {
    const schema = Object.assign(defaultSchema, Env.IS_DEV ? Dev : Prod);
    const { error } = Joi.object(schema).validate(Env, { ...options });
    if (error) {
      console.error('🚀 ~ MISSING REQUIRED ENV VARIABLES:');
      rej(error.details.map((x) => x.message));
    } else {
      res(null);
    }
  });
};
