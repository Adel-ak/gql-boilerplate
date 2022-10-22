import { GQL_QueryResolvers } from '../../generated-types/graphql.js';
import { WatchService } from '../services/watch.service.js';

export const Query: GQL_QueryResolvers = {
  filterWatches: (_, { input }, { injector }) => {
    const { filterWatches } = injector.get(WatchService);
    return filterWatches(input);
  },
};
