import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { toFieldErrors } from '../../utils/index.js';
import { WishService } from '../services/wish.service.js';
import { createWishDtoV } from './dto/create-wish.dto copy.js';
import { updateWishStatusDtoV } from './dto/update-wish-status.dto.js';

export const Mutation: GQL_MutationResolvers = {
  createWish: async (_, { input }, { injector, authUser }) => {
    console.log('🚀 ~ file: mutation.ts ~ line 25 ~ updateWishStatus: ~ input', input);

    const { error } = createWishDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const waitService = injector.get(WishService);

    const [wish, wishErr] = await waitService.create(input, authUser!);

    if (wishErr) return wishErr;

    wish!.__typename = 'Wish';

    return wish!;
  },
  updateWishStatus: async (_, { input }, { injector, authUser }) => {
    const { error } = updateWishStatusDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const waitService = injector.get(WishService);

    const [wish, wishErr] = await waitService.updateStatus(input, authUser!);

    if (wishErr) return wishErr;

    wish!.__typename = 'Wish';

    return wish!;
  },
};
