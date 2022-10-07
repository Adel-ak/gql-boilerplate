import { createModule } from 'graphql-modules';
import { resolvers as scalarResolvers } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import isAuthenticated from '../middleware/auth.js';
import { AppProvider } from '../services/app.service.js';
import { AppModule } from './generated-types/module-types.js';
import { GQL_ERoles } from '../../generated-types/graphql.js';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const { DateTime, ObjectID, JSON } = scalarResolvers;

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([
  ...loadedResolvers,
  {
    Upload: GraphQLUpload,
    DateTime,
    ObjectID,
    JSON,
  },
]);

const middlewares: AppModule.MiddlewareMap = {
  Query: {
    getAppProperties: [isAuthenticated([GQL_ERoles.Admin])],
  },
  Mutation: {
    updateAppProperties: [isAuthenticated([GQL_ERoles.Admin])],
  },
};

export const appModule = createModule({
  id: 'app-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
  providers: [AppProvider],
});
