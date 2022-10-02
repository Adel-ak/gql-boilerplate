import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { GqlResult } from '../../shared/types/index.js';
import { toResultFieldsError } from '../../utils/index.js';
import { UserService } from '../services/user.service.js';
import { mutateUserDtoV } from './dto/mutate-user.dto.js';
import mongoose from 'mongoose';
import { FirebaseService } from '../services/firebase.service.js';
import { validateObjectID } from '../../utils/joi.js';

const { Types } = mongoose;

export const Mutation: GQL_MutationResolvers = {
  createUser: async (_, { input }, { injector }) => {
    const { error } = mutateUserDtoV(input);

    if (error) {
      return toResultFieldsError(error);
    }

    const objID = new Types.ObjectId();

    const { createFirebaseUser, setClaims } = injector.get(FirebaseService);

    const fbErr = (await createFirebaseUser(input, objID.toString()))[1];

    if (fbErr) {
      return new GqlResult({
        success: false,
        error: fbErr,
      });
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.createUser(objID, input);

    if (user) {
      await setClaims(objID.toString(), input.role, input.permissions);
    }

    return new GqlResult({
      success: !!user,
      error: err,
      data: user,
    });
  },

  updateUser: async (_, { id, input }, { injector }) => {
    const { error: idError } = validateObjectID(id.toString());
    if (idError) {
      return toResultFieldsError(idError);
    }
    const { error } = mutateUserDtoV(input);
    if (error) {
      return toResultFieldsError(error);
    }
    const { updateUser, setClaims } = injector.get(FirebaseService);

    const fbErr = (await updateUser(id.toString(), input))[1];
    if (fbErr) {
      return new GqlResult({
        success: false,
        error: fbErr,
      });
    }

    const userService = injector.get(UserService);

    const [user, err] = await userService.updateUser(id, input);

    if (user) {
      await setClaims(id.toString(), input.role, input.permissions);
    }

    return new GqlResult({
      success: !!user,
      error: err,
      data: null,
    });
  },
};
