import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { toFieldErrors } from '../../utils/index.js';
import { UserService } from '../services/user.service.js';
import { createUserDtoV } from './dto/create-user.dto.js';
import { updateProfileDtoV } from './dto/update-profile.dto.js';
import { updateUserDtoV } from './dto/update-user.dto.js';

export const Mutation: GQL_MutationResolvers = {
  createUser: async (_, { input }, { injector }) => {
    const { error } = createUserDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const userService = injector.get(UserService);

    const existingUserErr = (await userService.findExistingUser({ userName: input.userName }))[1];

    if (existingUserErr) return existingUserErr;

    const [user, err] = await userService.createUser(input);

    if (err) return err;

    user!.__typename = 'User';

    return user!;
  },

  updateProfile: async (_, { input }, { injector, authUser }) => {
    const { error } = updateProfileDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.updateProfile(authUser!._id, input);

    if (err) return err;

    user!.__typename = 'User';

    return user!;
  },

  updateUser: async (_, { input }, { injector, authUser }) => {
    const { _id, ...restInput } = input;

    if (authUser!._id.equals(_id)) {
      return new ReqError({
        message: "Use 'updateProfile' mutation to update your account",
      });
    }

    const { error } = updateUserDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    if (Object.keys(restInput).length > 0) {
      const userService = injector.get(UserService);

      const [user, err] = await userService.updateUser(input);

      if (err) return err;

      user!.__typename = 'User';

      return user!;
    }

    return new ReqError({
      message: 'No fields specified for update to take place',
    });
  },
};
