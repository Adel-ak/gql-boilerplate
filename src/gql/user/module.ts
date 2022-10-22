import { createModule } from 'graphql-modules';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { UserProvider } from '../services/user.service.js';
import { UserModule } from './generated-types/module-types.js';
import isAuthenticated from '../middleware/auth.js';
import { GQL_ERoles } from '../../generated-types/graphql.js';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([...loadedResolvers, {}]);

const { Admin, Manager } = GQL_ERoles;

const middlewares: UserModule.MiddlewareMap = {
  Mutation: {
    createUser: [isAuthenticated([Admin, Manager])],
    updateProfile: [isAuthenticated()],
    updateUser: [isAuthenticated([Admin, Manager])],
    toggleUserActivation: [isAuthenticated([Admin, Manager])],
  },
  Query: {
    me: [isAuthenticated()],
    listUsers: [isAuthenticated([Admin, Manager])],
  },
};

export const userModule = createModule({
  id: 'user-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
  providers: [UserProvider],
});
