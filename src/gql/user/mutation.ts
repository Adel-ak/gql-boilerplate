import { GQL_ERoles, GQL_FieldErrors, GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { toFieldErrors } from '../../utils/index.js';
import { SessionService } from '../services/session.service.js';
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
    const { _id } = input;

    if (authUser!._id.equals(_id)) {
      return new ReqError({
        message: "Use 'updateProfile' mutation to update your account",
      });
    }
    const { Admin } = GQL_ERoles;
    if (authUser?.role !== Admin && input.role === Admin) {
      return {
        fieldErrors: [
          {
            field: 'role',
            message: "Only a 'Admin' user can assign a user as admin",
          },
        ],
        __typename: 'FieldErrors',
      } as GQL_FieldErrors;
    }

    const { error } = updateUserDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.updateUser(input);

    if (err) return err;

    user!.__typename = 'User';

    if (input.password) {
      const { invalidateSessionsByUserId } = injector.get(SessionService);
      await invalidateSessionsByUserId(_id);
    }

    return user!;
  },
  toggleUserActivation: async (_, { _id, active }, { injector, authUser }) => {
    if (authUser!._id.equals(_id)) {
      return new ReqError({
        message: 'You can not activate or deactivate your own account',
      });
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.toggleUserActivation(_id, active);

    if (err) return err;

    user!.__typename = 'User';

    if (!active) {
      const { invalidateSessionsByUserId } = injector.get(SessionService);
      await invalidateSessionsByUserId(_id);
    }

    return user!;
  },
};
