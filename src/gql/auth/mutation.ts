import dayjs from 'dayjs';
import { CookieOptions } from 'express';
import { Env } from '../../config/env.js';
import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { toFieldErrors } from '../../utils/index.js';
import { AuthService } from '../services/auth.service.js';
import { SessionService } from '../services/session.service.js';
import { loginDtoV } from './dto/login.dto.js';
import { refreshTokensDtoV } from './dto/refresh-tokens.dto.js';

const { IS_DEV } = Env;

const cookieOptions: CookieOptions = {
  secure: IS_DEV,
  httpOnly: true,
  sameSite: 'strict',
  expires: dayjs().utc().add(1, 'month').toDate(),
};

export const Mutation: GQL_MutationResolvers = {
  login: async (_, { input }, { injector, req, res }) => {
    const { error } = loginDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const authService = injector.get(AuthService);

    const [user, err] = await authService.verifyLogin(input);

    if (err) return err;

    const sessionService = injector.get(SessionService);

    const tokens = await sessionService.createSession(user!, req);

    res.cookie('accessToken', tokens.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    tokens.__typename = 'AuthTokens';

    return tokens;
  },

  signOut: async (_, __, { res }) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return true;
  },

  refreshSession: async (_, __, { injector, req, res }) => {
    const input = {
      accessToken: req.cookies.accessToken,
      refreshToken: req.cookies.refreshToken,
    };

    const { error } = refreshTokensDtoV(input);

    if (error) {
      return toFieldErrors(error);
    }

    const sessionService = injector.get(SessionService);

    const [tokens, err] = await sessionService.refreshTokenAndSession(input, req);

    if (err) return err;

    tokens!.__typename = 'AuthTokens';

    res.cookie('accessToken', tokens!.accessToken, cookieOptions);
    res.cookie('refreshToken', tokens!.refreshToken, cookieOptions);

    return tokens!;
  },
};
