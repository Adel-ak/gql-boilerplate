import pkgMongoose, { ConnectOptions } from 'mongoose';
import { Env } from '../config/env.js';

const { connect, set } = pkgMongoose;

export const initDb = async () => {
  const { IS_DEV, MONGODB_URI } = Env;

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

    set('debug', IS_DEV);

    console.log(`🚀 Connect to DB ${IS_DEV ? MONGODB_URI : 'Prod'}`);
  } catch (err) {
    console.error('🚀 ~ DB Connection err', err);
    process.exit(1);
  }
};
