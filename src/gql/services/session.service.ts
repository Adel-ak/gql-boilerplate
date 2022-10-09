import crypto from 'crypto';
import { Injectable, Scope } from 'graphql-modules';
import { Env } from '../../config/env.js';
import { SessionModel } from '../../db/model/session.model.js';
import { IUser, UserModel } from '../../db/model/user.model.js';
import { GoResponse, ISessionInfo } from '../../shared/types/index.js';
import { Request } from 'express';
import { ReqError } from '../../shared/types/gql.type.js';
import { GQL_AuthTokens, GQL_RefreshSessionInput } from '../../generated-types/graphql.js';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

@Injectable({
  global: true,
  scope: Scope.Singleton,
})
export class SessionService {
  createSession = async (user: IUser, req: Request): Promise<GQL_AuthTokens> => {
    const requestInfo: ISessionInfo = {
      ip: req.ip || null,
      userAgent: req.headers['user-agent'] || null,
    };
    const { token } = await this.makeSession(user, requestInfo);

    const tokens = {
      accessToken: this.createAccessToken(user, token),
      refreshToken: this.createRefreshToken(user),
    };
    return tokens;
  };
  createAccessToken = (user: IUser, sessionToken: string): string => {
    const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } = Env;

    const payload = {
      _id: user._id,
      deactivated: user.deactivated,
      name: user.name,
      userName: user.userName,
      role: user.role,
      ast: sessionToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const jwtOptions: jwt.SignOptions = {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    };

    const token = jwt.sign(payload, ACCESS_TOKEN_SECRET!, jwtOptions);
    return token;
  };

  createRefreshToken = (user: IUser): string => {
    const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = Env;

    const payload = {
      _id: user._id,
      role: user.role,
    };

    const jwtOptions: jwt.SignOptions = {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    };

    const token = jwt.sign(payload, REFRESH_TOKEN_SECRET!, jwtOptions);

    return token;
  };

  createSessionToken = (): string => {
    const token = crypto.randomBytes(43).toString('hex');
    return token;
  };

  makeSession = async (user: IUser, requestInfo: ISessionInfo) => {
    const sessionToken = this.createSessionToken();
    const session = await new SessionModel({
      userID: user._id,
      userRole: user.role,
      token: sessionToken,
      ...requestInfo,
    }).save();
    return session;
  };

  findSessionByToken = (sessionToken: string) => {
    return SessionModel.findOne({ token: sessionToken }).exec();
  };

  validateSession = async (decodedToken: jwt.JwtPayload): GoResponse<IUser, ReqError> => {
    const reqError = new ReqError({});
    try {
      const session = await this.findSessionByToken(decodedToken.ast);
      if (session) {
        if (session.valid) {
          const user = await UserModel.findById(session.userID).exec();

          if (user) {
            return [user.toObject(), null];
          }

          reqError.message = 'Session was found but no user data';

          return [null, reqError];
        }

        reqError.message = 'User session is not valid';

        return [null, reqError];
      }

      reqError.message = 'User session not found';

      return [null, reqError];
    } catch (err) {
      return [null, reqError];
    }
  };

  async refreshTokenAndSession(
    refreshTokensDto: GQL_RefreshSessionInput,
    req: Request,
  ): GoResponse<GQL_AuthTokens, ReqError> {
    const reqError = new ReqError({});

    try {
      const { accessToken, refreshToken } = refreshTokensDto;

      const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = Env;

      const userPayLoad = jwt.verify(accessToken!, ACCESS_TOKEN_SECRET!, { ignoreExpiration: true }) as jwt.JwtPayload;

      jwt.verify(refreshToken!, REFRESH_TOKEN_SECRET!, { ignoreExpiration: true });

      const userID = userPayLoad._id;
      const sessionToken = userPayLoad.ast;
      const session = await this.findSessionByToken(sessionToken);

      if (session) {
        const user = await UserModel.findById(userID).exec();

        if (user) {
          const requestInfo: ISessionInfo = {
            ip: req.ip || null,
            userAgent: req.headers['user-agent'] || null,
          };

          const newSessionToken = this.createSessionToken();

          session.token = newSessionToken;
          session.ip = requestInfo.ip;
          session.userAgent = requestInfo.userAgent;
          session._v = session._v + 1;
          session.updatedAt = dayjs().utc().toDate();

          await session.save();

          const tokens = {
            accessToken: this.createAccessToken(user, session.token),
            refreshToken: this.createRefreshToken(user),
          };

          return [tokens, null];
        }

        reqError.message = 'No user found.';

        return [null, reqError];
      }

      reqError.message = 'Session was not found.';

      return [null, reqError];
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === 'jwt malformed') {
          reqError.message = 'Invalid Tokens.';
        }
      }

      return [null, reqError];
    }
  }
}

export const SessionProvider = {
  provide: SessionService,
  useClass: SessionService,
};
