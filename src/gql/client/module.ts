import { createModule } from 'graphql-modules';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { ClientProvider } from '../services/clients.service.js';
import { ClientModule } from './generated-types/module-types.js';
import isAuthenticated from '../middleware/auth.js';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([...loadedResolvers, {}]);

const middlewares: ClientModule.MiddlewareMap = {
  Query: {
    filterClients: [isAuthenticated()],
  },
};

export const clientModule = createModule({
  id: 'client-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
  providers: [ClientProvider],
});
