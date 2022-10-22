import pkgMongoose, { ConnectOptions } from 'mongoose';
import { Env } from '../config/env.js';
import faker from 'faker';
import { IUser, UserModel } from './model/user.model.js';
import { hashPassword } from '../gql/services/argon2.service.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { enumValues, randNum } from '../utils/index.js';
import { ClientModel, IClient } from './model/client.model.js';
import { IWatch, WatchModel } from './model/watch.model.js';
import { GQL_ERoles, GQL_EWishStatus } from '../generated-types/graphql.js';
import { IWish, WishModel } from './model/wish.model.js';

dayjs.extend(utc);

const { connect, set, Types } = pkgMongoose;

const runSeed = async () => {
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
    await seedWishes(3000);

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
    const stores = ['01-Salhiya', '05-Avenues', '06-Gate-Mall', '08-Assima-Mall'];

    const promise = [...Array(size)].map<Promise<IUser>>(async () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const userName = `${firstName[0]}.${lastName}`.toLowerCase();
      const role = enumValues(GQL_ERoles)[randNum(0, 2)] as GQL_ERoles;
      return {
        userName,
        password,
        role,
        store: stores[randNum(0, stores.length - 1)],
        _id: new Types.ObjectId(),
        active: faker.datatype.boolean(),
        name: `${firstName} ${lastName}`,
        createdAt: dayjs().utc().toDate(),
        _v: 0,
      };
    });
    const users = await Promise.all(promise);

    await UserModel.insertMany(users, { ordered: false });

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

    await ClientModel.insertMany(clients, { ordered: false });

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

    await WatchModel.insertMany(watches, { ordered: false });

    console.log(`🚀 Watches seeded`);
  } catch (err) {}
};

const seedWishes = async (size: number) => {
  try {
    const [clients, watches, users] = await Promise.all([
      ClientModel.find({}).exec(),
      WatchModel.find({}).exec(),
      UserModel.find({ role: GQL_ERoles.User }).exec(),
    ]);

    const wishes = [...Array(size)].map<IWish>(() => {
      const client = clients[randNum(0, clients.length - 1)];
      const watch = watches[randNum(0, watches.length - 1)];
      const user = users[randNum(0, users.length - 1)];
      const statuses = enumValues(GQL_EWishStatus);

      const status = statuses[randNum(0, statuses.length - 1)] as GQL_EWishStatus;

      const date = dayjs().utc().subtract(randNum(0, 9), 'months').toDate();

      return {
        _id: new Types.ObjectId(),
        user: user._id as unknown as IUser,
        clientId: client._id,
        clientName: client.name,
        clientCid: client.cid,
        clientPhone: client.phone,
        watchId: watch._id,
        watchCode: watch.code,
        watchName: watch.name,
        store: user.store!,
        remark: '',
        status: status,
        statusHistory: [
          {
            status,
            at: date,
            user: user._id as unknown as IUser,
          },
        ],
        createdAt: date,
        _v: 0,
      };
    });

    await WishModel.insertMany(wishes, { ordered: false });

    console.log(`🚀 Wishes seeded`);
  } catch (err) {
    console.log('🚀 ~ file: seed.ts ~ line 171 ~ seedWishes ~ err', err);
  }
};

runSeed();
