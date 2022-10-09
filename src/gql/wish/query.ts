import { GQL_WishResolvers } from '../../generated-types/graphql.js';
import { TObjectId } from '../../shared/types/index.js';
import { isValidObjectID } from '../../utils/index.js';

export const Wish: GQL_WishResolvers = {
  client: async (wish, _, { loaders: { clientLoader } }) => {
    if (isValidObjectID(wish.client)) {
      const data = await clientLoader.load(wish.client as unknown as TObjectId);
      return data;
    }
    return wish.client;
  },
  watch: async (wish, _, { loaders: { watchLoader } }) => {
    if (isValidObjectID(wish.watch)) {
      const data = await watchLoader.load(wish.watch as unknown as TObjectId);
      return data;
    }
    return wish.watch;
  },
};
