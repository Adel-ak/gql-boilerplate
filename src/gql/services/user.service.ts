import dayjs from 'dayjs';
import { Injectable, Scope } from 'graphql-modules';
import { UserSchema } from '../../db/schema/user.schema.js';
import { GQL_MutateUserInput, GQL_ObjectId } from '../../generated-types/graphql.js';
import { GoResponse, ReqError } from '../../shared/types/index.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class UserService {
  createUser = async (_id: GQL_ObjectId, input: GQL_MutateUserInput): Promise<GoResponse<any, ReqError>> => {
    try {
      const now = dayjs().utc();
      const user = new UserSchema({
        ...input,
        _id,
        createdAt: now,
        _v: 0,
      });

      await user.save();

      return [user, null];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  updateUser = async (_id: GQL_ObjectId, input: GQL_MutateUserInput): Promise<GoResponse<any, ReqError>> => {
    try {
      const now = dayjs().utc();

      const user = await UserSchema.findOneAndUpdate(_id, {
        $set: {
          ...input,
          updatedAt: now,
        },
        $inc: { _v: 1 },
      }).exec();

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
