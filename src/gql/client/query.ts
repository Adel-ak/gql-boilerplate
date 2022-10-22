import { GQL_QueryResolvers } from '../../generated-types/graphql.js';
import { ClientService } from '../services/clients.service.js';

export const Query: GQL_QueryResolvers = {
  filterClients: async (_, { input }, { injector }) => {
    const { filterClients } = injector.get(ClientService);
    return filterClients(input);
  },
};
