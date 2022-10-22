import { createModule } from 'graphql-modules';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { WatchModule } from './generated-types/module-types.js';
import { WatchProvider } from '../services/watch.service.js';
import isAuthenticated from '../middleware/auth.js';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([...loadedResolvers, {}]);

const middlewares: WatchModule.MiddlewareMap = {
  Query: {
    filterWatches: [isAuthenticated()],
  },
};

export const watchModule = createModule({
  id: 'watch-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
  providers: [WatchProvider],
});
