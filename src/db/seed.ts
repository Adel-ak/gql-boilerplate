import pkgMongoose, { ConnectOptions } from 'mongoose';
import { Env } from '../config/env.js';
import faker from 'faker';
import { IUser, UserSchema } from './schema/user.schema.js';
import { hashPassword } from '../gql/services/argon2.service.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { enumValues, randNum } from '../utils/index.js';
import { ClientSchema, IClient } from './schema/client.schema.js';
import { IWatch, WatchSchema } from './schema/watch.schema.js';
import { GQL_ERoles } from '../generated-types/graphql.js';

dayjs.extend(utc);

const { connect, set, Types } = pkgMongoose;

export const runSeed = async () => {
  const { IS_DEV, MONGODB_URI, MONGODB_DEBUG } = Env;

  try {
    const options: ConnectOptions = {
      autoIndex: true,
      autoCreate: true,
      dbName: 'test',
    };

    await connect(MONGODB_URI, options);

    set('debug', MONGODB_DEBUG);

    console.log(`🚀 Connect to DB ${IS_DEV ? MONGODB_URI : 'Prod'}`);
    await Promise.all([seedUsers(20), seedClients(30), seedWatches()]);
    console.log(`🚀 DB is seeded`);

    process.exit(0);
  } catch (err) {
    console.error('🚀 ~ DB Connection err', err);
    process.exit(1);
  }
};

const seedUsers = async (size: number) => {
  try {
    const password = await hashPassword('rolexDemo');

    const promise = [...Array(size)].map<Promise<IUser>>(async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = `${firstName[0]}.${lastName}`.toLowerCase();
      const role = enumValues(GQL_ERoles)[randNum(0, 2)] as GQL_ERoles;
      return {
        userName,
        password,
        role,
        _id: new Types.ObjectId(),
        deactivated: faker.datatype.boolean(),
        name: `${firstName} ${lastName}`,
        createdAt: dayjs().utc().toDate(),
        _v: 0,
      };
    });
    const users = await Promise.all(promise);

    await UserSchema.insertMany(users, { ordered: false });

    console.log(`🚀 Users seeded`);
  } catch (err) {}
};

const seedClients = async (size: number) => {
  try {
    const clients = [...Array(size)].map<IClient>(() => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();

      return {
        _id: new Types.ObjectId(),
        name: `${firstName} ${lastName}`,
        cid: faker.phone.phoneNumber('2###########'),
        phone: faker.phone.phoneNumber('9#######'),
        blackListed: faker.datatype.boolean(),
        premium: faker.datatype.boolean(),
        createdAt: dayjs().utc().toDate(),
        _v: 0,
      };
    });

    await ClientSchema.insertMany(clients, { ordered: false });

    console.log(`🚀 Clients seeded`);
  } catch (err) {}
};

const seedWatches = async () => {
  const data = (
    await import('../data/watches.json', {
      assert: {
        type: 'json',
      },
    })
  ).default;
  try {
    const watches = data.map<IWatch>((w) => {
      return {
        _id: new Types.ObjectId(),
        name: w.title,
        code: w.rmc,
        disabled: faker.datatype.boolean(),
        createdAt: dayjs().utc().toDate(),
        _v: 0,
      };
    });

    await WatchSchema.insertMany(watches, { ordered: false });

    console.log(`🚀 Watches seeded`);
  } catch (err) {}
};

runSeed();
