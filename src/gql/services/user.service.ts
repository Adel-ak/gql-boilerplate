import dayjs from 'dayjs';
import { Injectable, Scope } from 'graphql-modules';
import { PaginateOptions } from 'mongoose';
import { IUser, UserModel } from '../../db/model/user.model.js';
import {
  GQL_FieldErrors,
  GQL_CreateUserInput,
  GQL_UpdateProfileInput,
  GQL_ListUsersResult,
  GQL_PaginateOptions,
  GQL_ListUsersFilterInput,
  GQL_UpdateUserInput,
} from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { GoResponse, TObjectId } from '../../shared/types/index.js';
import { hashPassword } from './argon2.service.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class UserService {
  getUsersList = async (
    inputOptions: GQL_PaginateOptions,
    { storeCode, ...inputFilter }: GQL_ListUsersFilterInput,
  ): GoResponse<GQL_ListUsersResult, ReqError> => {
    try {
      const page = inputOptions.page || 1;

      let limit = inputOptions.limit || 10;
      limit = limit > 10 ? 10 : limit;

      const options: PaginateOptions = {
        ...(inputOptions as PaginateOptions),
        page,
        limit,
      };

      const filter: Record<string, any> = { ...inputFilter };

      if (storeCode) {
        filter['store.code'] = storeCode;
      }

      const userDoc = await UserModel.paginate(filter, options);

      return [userDoc, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  findOne = async (id: TObjectId): GoResponse<IUser, ReqError> => {
    try {
      const userDoc = await UserModel.findById(id).exec();
      return [userDoc, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  findExistingUser = async (input: Partial<IUser>): GoResponse<IUser, GQL_FieldErrors | ReqError> => {
    try {
      const userDoc = await UserModel.findOne(input).exec();
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
      const user = new UserModel({
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

  updateProfile = async (
    _id: TObjectId,
    { password, ...input }: GQL_UpdateProfileInput,
  ): GoResponse<IUser, ReqError> => {
    try {
      const now = dayjs().utc();

      const hashedPass = await hashPassword(password!);

      const user = await UserModel.findOneAndUpdate(
        { _id },
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
      console.log('🚀 ~ file: user.service.ts ~ line 128 ~ UserService ~ err', err);
      return [null, new ReqError({})];
    }
  };

  updateUser = async ({ _id, ...input }: GQL_UpdateUserInput): GoResponse<IUser, ReqError> => {
    try {
      const now = dayjs().utc();

      if (input.password) input.password = await hashPassword(input.password!);

      const user = await UserModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...input,
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
