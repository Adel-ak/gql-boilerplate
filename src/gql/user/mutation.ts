import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { GqlResult } from '../../shared/types/gql.type.js';
import { toResultFieldsError } from '../../utils/index.js';
import { UserService } from '../services/user.service.js';
import { createUserDtoV } from './dto/create-user.dto.js';
import { updateProfileDtoV } from './dto/update-profile.dto.js';

export const Mutation: GQL_MutationResolvers = {
  createUser: async (_, { input }, { injector }) => {
    const { error } = createUserDtoV(input);

    if (error) {
      return toResultFieldsError(error);
    }

    const userService = injector.get(UserService);

    const existingUserErr = (await userService.findExistingUser({ email: input.email }))[1];

    if (existingUserErr) {
      return new GqlResult({
        success: false,
        error: existingUserErr,
      });
    }

    const [user, err] = await userService.createUser(input);

    return new GqlResult({
      success: !!user,
      error: err,
      data: user,
    });
  },

  updateProfile: async (_, { input }, { injector, authUser }) => {
    const { error } = updateProfileDtoV(input);

    if (error) {
      return toResultFieldsError(error);
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.updateUser(authUser!._id, input);

    return new GqlResult({
      success: !!user,
      error: err,
      data: user,
    });
  },
};
