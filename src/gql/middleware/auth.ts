import { ApolloError, ForbiddenError } from 'apollo-server-core';
import jwt from 'jsonwebtoken';
import { GQL_ERoles } from '../../generated-types/graphql.js';
import { Middleware } from '../../shared/types/graphql-modules.type.js';
import { AuthService } from '../services/auth.service.js';
import { SessionService } from '../services/session.service.js';

const isAuthenticated = (allowedRoles: GQL_ERoles[] = [], jwtOptions: jwt.VerifyOptions = {}): Middleware => {
  return async ({ context }, next) => {
    const { req, injector } = context;

    const bearer = req.cookies.accessToken;

    const authService = injector.get(AuthService);
    const sessionService = injector.get(SessionService);

    const [decodedToken, decodeErr] = await authService.validateToken(bearer, jwtOptions);

    if (decodeErr) throw new ApolloError(decodeErr.message, decodeErr.code);

    const [user, sessionErr] = await sessionService.validateSession(decodedToken!);

    if (sessionErr) throw new ApolloError(sessionErr.message, sessionErr.code);

    if (!!allowedRoles.length && !allowedRoles.includes(user!.role)) {
      throw new ForbiddenError('Invalid Authentication Role.');
    }

    context.authUser = user;

    return next();
  };
};

export default isAuthenticated;
