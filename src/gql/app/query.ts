import { GQL_ERoles, GQL_QueryResolvers } from '../../generated-types/graphql.js';
import { AppService } from '../services/app.service.js';

export const Query: GQL_QueryResolvers = {
  getAppProperties: async (_, __, { injector, authUser }) => {
    const appService = injector.get(AppService);
    const properties = await appService.getProperties();
    const user = authUser!;
    const { Admin, User } = GQL_ERoles;
    if (user.role !== Admin) {
      properties.roles = [User];
      properties.stores = [user.store!];
    }

    return properties;
  },
};
