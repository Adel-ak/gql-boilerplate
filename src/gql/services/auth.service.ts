import { Injectable, Scope } from 'graphql-modules';
import jwt from 'jsonwebtoken';
import { Env } from '../../config/env.js';
import { IUser, UserSchema } from '../../db/schema/user.schema.js';
import { GQL_FieldsError, GQL_LoginInput } from '../../generated-types/graphql.js';
import { ReqError } from '../../shared/types/gql.type.js';
import { GoResponse } from '../../shared/types/index.js';
import { comparePass } from './argon2.service.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class AuthService {
  verifyLogin = async (input: GQL_LoginInput): GoResponse<IUser, GQL_FieldsError | ReqError> => {
    try {
      const user = await UserSchema.findOne({ email: input.email }).exec();
      const fieldsErr: GQL_FieldsError = {
        fields: [],
        __typename: 'FieldsError',
      };
      if (user) {
        const doesPassMatch = await comparePass(user.password, input.password);
        if (doesPassMatch) {
          return [user, null];
        } else {
          fieldsErr.fields.push({
            field: 'password',
            message: 'Invalid password',
          });
        }
      } else {
        fieldsErr.fields.push({
          field: 'email',
          message: 'User not found.',
        });
      }

      return [null, fieldsErr];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  validateToken = async (
    authorization: string | undefined,
    jwtOptions: jwt.VerifyOptions = {},
  ): GoResponse<jwt.JwtPayload, ReqError> => {
    try {
      if (authorization && typeof authorization === 'string' && authorization !== 'null' && authorization !== null) {
        if (authorization.startsWith('Bearer')) {
          const { ACCESS_TOKEN_SECRET } = Env;
          const token = authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET!, jwtOptions) as jwt.JwtPayload;

          return [decodedToken, null];
        }

        return [null, new ReqError({ message: 'Invalid token' })];
      }

      return [null, new ReqError({ message: 'You must be logged in' })];
    } catch (err) {
      const reqError = new ReqError({});

      if (err instanceof jwt.JsonWebTokenError) {
        switch (err.message) {
          case 'jwt expired':
            reqError.message = 'Token expired';
            break;
          case 'invalid signature':
          case 'jwt malformed':
            reqError.message = 'Invalid token';
            break;
        }
      }

      return [null, reqError];
    }
  };
}

export const AuthProvider = {
  provide: AuthService,
  useClass: AuthService,
};
