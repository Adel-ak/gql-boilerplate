import dayjs from 'dayjs';
import { Injectable, Scope } from 'graphql-modules';
import { IUser, UserSchema } from '../../db/schema/user.schema.js';
import { GQL_FieldErrors, GQL_CreateUserInput, GQL_UpdateProfileInput } from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { GoResponse, TObjectId } from '../../shared/types/index.js';
import { hashPassword } from './argon2.service.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class UserService {
  findOne = async (id: TObjectId): GoResponse<IUser, ReqError> => {
    try {
      const userDoc = await UserSchema.findById(id).exec();
      return [userDoc, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  findExistingUser = async (input: Partial<IUser>): GoResponse<IUser, GQL_FieldErrors | ReqError> => {
    try {
      const userDoc = await UserSchema.findOne(input).exec();
      if (userDoc) {
        const fieldErrs: GQL_FieldErrors = {
          fieldErrors: [],
          __typename: 'FieldErrors',
        };
        if (userDoc.userName === input.userName) {
          fieldErrs.fieldErrors.push({
            field: 'userName',
            message: 'The user name is in use by another user.',
          });
        }
        if (fieldErrs.fieldErrors.length) return [null, fieldErrs];
      }
      return [userDoc, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  createUser = async (input: GQL_CreateUserInput): GoResponse<IUser, ReqError> => {
    try {
      const hashedPass = await hashPassword(input.password);

      const now = dayjs().utc();
      const user = new UserSchema({
        ...input,
        password: hashedPass,
        createdAt: now,
        _v: 0,
      });

      await user.save();

      return [user, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  updateUser = async (_id: TObjectId, { password, ...input }: GQL_UpdateProfileInput): GoResponse<IUser, ReqError> => {
    try {
      const now = dayjs().utc();

      const hashedPass = await hashPassword(password!);

      const user = await UserSchema.findOneAndUpdate(
        _id,
        {
          $set: {
            ...input,
            password: hashedPass,
            updatedAt: now,
          },
          $inc: { _v: 1 },
        },
        { new: true },
      ).exec();

      return [user, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };
}

export const UserProvider = {
  provide: UserService,
  useClass: UserService,
};
