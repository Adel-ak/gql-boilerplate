import dayjs from 'dayjs';
import { Injectable, Scope } from 'graphql-modules';
import { PaginateOptions } from 'mongoose';
import { IUser, UserModel } from '../../db/model/user.model.js';
import {
  GQL_CreateUserInput,
  GQL_ERoles,
  GQL_FieldErrors,
  GQL_ListUsersInput,
  GQL_ListUsersResult,
  GQL_UpdateProfileInput,
  GQL_UpdateUserInput,
} from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { GoResponse, TObjectId } from '../../shared/types/index.js';
import { createMongoDuplicateFieldErrors } from '../../utils/index.js';
import { hashPassword } from './argon2.service.js';
import escapeStringRegexp from 'escape-string-regexp';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class UserService {
  getUsersList = async (input: GQL_ListUsersInput, authUser: IUser): GoResponse<GQL_ListUsersResult, ReqError> => {
    try {
      const inputOptions = input.options || {};

      const search = input.search;

      const page = inputOptions.page || 1;

      const maxLimit = 20;

      let limit = inputOptions.limit || maxLimit;
      limit = limit > maxLimit ? maxLimit : limit;

      const options: PaginateOptions = {
        ...(inputOptions as PaginateOptions),
        page,
        limit,
      };

      const filter: Record<string, any> = input.filter || {};
      const { Manager, Admin } = GQL_ERoles;
      if (authUser.role === Manager) {
        filter.role = { $ne: Admin };
        filter.store = authUser.store;
      }

      if (search) {
        const regex = new RegExp(`${escapeStringRegexp(search)}`, 'gi');

        filter.$or = [{ userName: { $regex: regex } }];
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

  createUser = async (input: GQL_CreateUserInput): GoResponse<IUser, ReqError | GQL_FieldErrors> => {
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
    } catch (err: any) {
      if (err.name === 'MongoServerError') {
        if (err.code === 11000) {
          return [null, createMongoDuplicateFieldErrors(err)];
        }
      }

      return [null, new ReqError({})];
    }
  };

  updateProfile = async (
    _id: TObjectId,
    { password, ...input }: GQL_UpdateProfileInput,
  ): GoResponse<IUser, ReqError | GQL_FieldErrors> => {
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
    } catch (err: any) {
      if (err.name === 'MongoServerError') {
        if (err.code === 11000) {
          return [null, createMongoDuplicateFieldErrors(err)];
        }
      }
      return [null, new ReqError({})];
    }
  };

  updateUser = async ({ _id, ...input }: GQL_UpdateUserInput): GoResponse<IUser, ReqError | GQL_FieldErrors> => {
    try {
      const now = dayjs().utc();

      if (input.password) input.password = await hashPassword(input.password!);
      if (input.role === GQL_ERoles.Admin) input.store = null;
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
    } catch (err: any) {
      if (err.name === 'MongoServerError') {
        if (err.code === 11000) {
          return [null, createMongoDuplicateFieldErrors(err)];
        }
      }
      return [null, new ReqError({})];
    }
  };

  toggleUserActivation = async (_id: TObjectId, active: boolean): GoResponse<IUser, ReqError> => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            active,
          },
        },
        { new: true },
      );

      return [user, null];
    } catch (err: any) {
      return [null, new ReqError({})];
    }
  };
}

export const UserProvider = {
  provide: UserService,
  useClass: UserService,
};
