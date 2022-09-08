import { createModule } from 'graphql-modules';
import { resolvers as scalarResolvers } from 'graphql-scalars';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { __dirname } from '../../utils/path.js';
import { loadFiles } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';

const dirname = __dirname(import.meta.url);

// Loads up all type definitions and resolvers
const [loadedTypeDefs, loadedResolvers] = await Promise.all([
  loadFiles(`${dirname}/typeDefs/*.gql.{js,ts}`),
  loadFiles(`${dirname}/*{query,mutation,subscription}.{js,ts}`),
]);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers([...loadedResolvers, scalarResolvers, { Upload: GraphQLUpload }]);

const middlewares = {
  Query: {
    me: [],
  },
};

export const appModule = createModule({
  id: 'app-module',
  dirname: __dirname(import.meta.url),
  typeDefs,
  resolvers,
  middlewares,
});
