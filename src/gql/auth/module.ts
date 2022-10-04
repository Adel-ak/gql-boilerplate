import { createModule } from 'graphql-modules';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { SessionProvider } from '../services/session.service.js';
import { AuthProvider } from '../services/auth.service.js';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([...loadedResolvers, {}]);

const middlewares = {
  Query: {
    me: [],
  },
};

export const authModule = createModule({
  id: 'auth-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
  providers: [AuthProvider, SessionProvider],
});
