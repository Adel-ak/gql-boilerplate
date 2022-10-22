import {
  GQL_QueryResolvers,
  GQL_WishResolvers,
  GQL_WishStatusHistoryResolvers,
} from '../../generated-types/graphql.js';
import { TObjectId } from '../../shared/types/index.js';
import { isValidObjectId } from '../../utils/index.js';
import { WishService } from '../services/wish.service.js';

export const Query: GQL_QueryResolvers = {
  listWishes: async (_, { input }, { injector, authUser }) => {
    const { getWishesList } = injector.get(WishService);
    return await getWishesList(input, authUser!);
  },
};

export const Wish: GQL_WishResolvers = {
  user: async (wish, _, { loaders: { userLoader } }) => {
    if (isValidObjectId(wish.user)) {
      const data = await userLoader.load(wish.user as unknown as TObjectId);
      return data;
    }
    return wish.user;
  },
};

export const WishStatusHistory: GQL_WishStatusHistoryResolvers = {
  user: async (statusHistory, _, { loaders: { userLoader } }) => {
    if (isValidObjectId(statusHistory.user)) {
      const data = await userLoader.load(statusHistory.user as unknown as TObjectId);
      return data;
    }
    return statusHistory.user;
  },
};
