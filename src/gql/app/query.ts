import { GQL_QueryResolvers } from '../../generated-types/graphql.js';
import { AppService } from '../services/app.service.js';

export const Query: GQL_QueryResolvers = {
  getAppProperties: async (_, __, { injector }) => {
    const appService = injector.get(AppService);
    const properties = await appService.getProperties();

    return properties!;
  },
};
