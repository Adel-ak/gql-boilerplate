import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { toFieldErrors } from '../../utils/index.js';
import { WishService } from '../services/waitList.service.js';
import { addToWishListDtoV } from './dto/add-to-wish-list.dto.js';

export const Mutation: GQL_MutationResolvers = {
  addToWishList: async (_, { input }, { injector, authUser }) => {
    const { error } = addToWishListDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const waitListService = injector.get(WishService);

    const [wish, wishErr] = await waitListService.addToList(input, authUser!);

    if (wishErr) return wishErr;

    wish!.__typename = 'Wish';

    return wish!;
  },
};
