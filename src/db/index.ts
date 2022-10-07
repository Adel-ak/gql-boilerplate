import pkgMongoose, { ConnectOptions, SchemaOptions } from 'mongoose';
import { Env } from '../config/env.js';

const { connect, set, Types } = pkgMongoose;

export const schemaDefaultOptions: SchemaOptions = {
  timestamps: true,
  versionKey: '_v',
};

export const genDefaultID = () => new Types.ObjectId();

export const initDb = async () => {
  const { IS_DEV, MONGODB_URI, MONGODB_DEBUG } = Env;

  try {
    const options: ConnectOptions = {
      maxPoolSize: 200,
      minPoolSize: 100,
      family: 4,
      autoIndex: true,
      autoCreate: true,
      socketTimeoutMS: 10000,
    };

    await connect(MONGODB_URI, options);

    set('debug', MONGODB_DEBUG);

    console.log(`🚀 Connect to DB ${IS_DEV ? MONGODB_URI : 'Prod'}`);
  } catch (err) {
    console.error('🚀 ~ DB Connection err', err);
    process.exit(1);
  }
};
