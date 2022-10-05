import dayjs from 'dayjs';
import { CookieOptions } from 'express';
import { Env } from '../../config/env.js';
import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { GqlResult } from '../../shared/types/gql.type.js';
import { toResultFieldsError } from '../../utils/index.js';
import { AuthService } from '../services/auth.service.js';
import { SessionService } from '../services/session.service.js';
import { loginDtoV } from './dto/login.dto.js';
import { refreshTokensDtoV } from './dto/refresh-tokens.dto.js';

export const Mutation: GQL_MutationResolvers = {
  login: async (_, { input }, { injector, req, res }) => {
    const { error } = loginDtoV(input);

    if (error) {
      return toResultFieldsError(error);
    }

    const authService = injector.get(AuthService);

    const [user, err] = await authService.verifyLogin(input);

    if (err) {
      return new GqlResult({
        success: false,
        error: err,
      });
    }

    const sessionService = injector.get(SessionService);

    const tokens = await sessionService.createSession(user!, req);

    const { IS_DEV } = Env;

    const cookieOptions: CookieOptions = {
      secure: IS_DEV,
      httpOnly: true,
      sameSite: 'strict',
      expires: dayjs().utc().add(1, 'month').toDate(),
    };

    res.cookie('accessToken', tokens.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    return new GqlResult({
      success: true,
      data: tokens,
    });
  },

  signOut: async (_, __, { res }) => {
    res.clearCookie('accessToken').clearCookie('refreshToken');
    return true;
  },
  refreshSession: async (_, { input }, { injector, req }) => {
    const { error } = refreshTokensDtoV(input);
    if (error) {
      return toResultFieldsError(error);
    }

    const sessionService = injector.get(SessionService);

    const [tokens, err] = await sessionService.refreshTokenAndSession(input, req);

    return new GqlResult({
      success: !!tokens,
      error: err,
      data: tokens,
    });
  },
};
