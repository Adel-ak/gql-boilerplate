import { GQL_QueryResolvers } from '../../generated-types/graphql.js';
import { UserService } from '../services/user.service.js';

export const Query: GQL_QueryResolvers = {
  me: async (_, __, { injector, authUser }) => {
    const userService = injector.get(UserService);

    const [user, err] = await userService.findOne(authUser!._id);

    if (err) return err;

    user!.__typename = 'User';

    return user!;
  },
  listUsers: async (_, { input }, { injector, authUser }) => {
    const userService = injector.get(UserService);

    const [users] = await userService.getUsersList(input || {}, authUser!);

    return users!;
  },
};
