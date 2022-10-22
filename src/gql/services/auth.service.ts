import { Injectable, Scope } from 'graphql-modules';
import jwt from 'jsonwebtoken';
import { Env } from '../../config/env.js';
import { IUser, UserModel } from '../../db/model/user.model.js';
import { GQL_FieldErrors, GQL_LoginInput } from '../../generated-types/graphql.js';
import { FieldErrors, ReqError } from '../../shared/types/gql.type.js';
import { GoResponse } from '../../shared/types/index.js';
import { comparePass } from './argon2.service.js';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class AuthService {
  verifyLogin = async (input: GQL_LoginInput): GoResponse<IUser, GQL_FieldErrors | ReqError> => {
    try {
      const user = await UserModel.findOne({ userName: input.userName }).exec();
      const fe = new FieldErrors();
      if (user) {
        const doesPassMatch = await comparePass(user.password, input.password);
        if (doesPassMatch) {
          return [user, null];
        } else {
          fe.fieldErrors.push({
            field: 'password',
            message: 'Invalid password',
          });
        }
      } else {
        fe.fieldErrors.push({
          field: 'userName',
          message: 'User not found.',
        });
      }

      return [null, fe];
    } catch (err) {
      return [null, new ReqError({})];
    }
  };

  validateToken = async (
    authorization?: string,
    jwtOptions: jwt.VerifyOptions = {},
  ): GoResponse<jwt.JwtPayload, ReqError> => {
    try {
      if (authorization) {
        const { ACCESS_TOKEN_SECRET } = Env;

        const decodedToken = jwt.verify(authorization, ACCESS_TOKEN_SECRET!, jwtOptions) as jwt.JwtPayload;

        return [decodedToken, null];
      }

      return [null, new ReqError({ message: 'You must be logged in', code: 'UNAUTHENTICATED' })];
    } catch (err) {
      const reqError = new ReqError({});

      if (err instanceof jwt.JsonWebTokenError) {
        switch (err.message) {
          case 'jwt expired':
            reqError.message = 'Token expired';
            reqError.code = 'TOKEN_EXPIRED';

            break;
          case 'invalid signature':
          case 'jwt malformed':
            reqError.message = 'Invalid token';
            reqError.code = 'INVALID_TOKEN';
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
