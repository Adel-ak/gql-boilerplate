import { ApolloError, ForbiddenError } from 'apollo-server-core';
import { ERoles } from '../../shared/enums.js';
import { Middleware } from '../../shared/types/graphql-modules.type.js';
import { AuthService } from '../services/auth.service.js';
import { SessionService } from '../services/session.service.js';

const isAuthenticated = (allowedRoles: ERoles[] = []): Middleware => {
  return async ({ context }, next) => {
    const { req, injector } = context;

    const bearer = req.cookies.authorization || req.headers.authorization;

    const authService = injector.get(AuthService);
    const sessionService = injector.get(SessionService);

    const [decodedToken, decodeErr] = await authService.validateToken(bearer);

    if (decodeErr) throw new ApolloError(decodeErr.message);

    const [user, sessionErr] = await sessionService.validateSession(decodedToken!);

    if (sessionErr) throw new ApolloError(sessionErr.message);

    if (!!allowedRoles.length && !allowedRoles.includes(user!.role)) {
      throw new ForbiddenError('Invalid Authentication Role.');
    }

    context.authUser = user;

    return next();
  };
};

export default isAuthenticated;
