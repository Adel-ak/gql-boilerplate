import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { GqlResult } from '../../shared/types/index.js';
import { toResultFieldsError } from '../../utils/index.js';
import { UserService } from '../services/user.service.js';
import { createUserDtoV } from './dto/create-user.dto.js';
import mongoose from 'mongoose';
import { FirebaseService } from '../services/firebase.service.js';

const { Types } = mongoose;

export const Mutation: GQL_MutationResolvers = {
  createUser: async (_, { input }, { injector }) => {
    const { error } = createUserDtoV(input);
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
};
