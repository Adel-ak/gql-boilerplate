import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { ERoles } from '../../shared/enums.js';
import { Middleware } from '../../shared/types/graphql-modules.js';
import { FirebaseService } from '../services/firebase.service.js';
import { AuthUser } from '../../shared/types/index.js';

const isAuthenticated = (allowedRoles: ERoles[] = [ERoles.Admin]): Middleware => {
  return async ({ context }, next) => {
    const bearer = context.req.headers.authorization;
    const token = bearer ? bearer.replace('Bearer ', '') : null;

    if (token) {
      const { auth } = context.injector.get(FirebaseService);
      const decoded = (await auth().verifyIdToken(token, false)) as AuthUser;
      if (allowedRoles.includes(decoded.role)) {
        context.authUser = decoded;

        return next();
      }
      throw new ForbiddenError('Invalid Authentication Role.');
    }

    throw new AuthenticationError('You must be logged in.');
  };
};

export default isAuthenticated;
