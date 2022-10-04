import Joi from 'joi';
import { Env } from './env.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

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

export const validateEnv = async (): Promise<Joi.ValidationError | null> => {
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
