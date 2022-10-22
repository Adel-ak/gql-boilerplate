import { clientLoader, watchLoader, userLoader } from '../../gql/loader/index.js';

export type DataLoader = {
  clientLoader: ReturnType<typeof clientLoader>;
  watchLoader: ReturnType<typeof watchLoader>;
  userLoader: ReturnType<typeof userLoader>;
};
