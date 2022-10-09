import { clientLoader } from '../../gql/loader/client.loader.js';
import { watchLoader } from '../../gql/loader/watch.loader.js';

export type DataLoader = {
  clientLoader: ReturnType<typeof clientLoader>;
  watchLoader: ReturnType<typeof watchLoader>;
};
