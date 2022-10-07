import { GQL_MutationResolvers } from '../../generated-types/graphql.js';
import { AppService } from '../services/app.service.js';

export const Mutation: GQL_MutationResolvers = {
  updateAppProperties: async (_, { input }, ctx) => {
    const { injector } = ctx;
    const appService = injector.get(AppService);
    const properties = await appService.updateProperties(input);
    const authUser = ctx.authUser;

    ctx.log = {
      user: authUser?.userName,
      role: authUser?.role,
      action: `Updated Properties`,
      msg: 'blah blah blah',
    };
    return properties!;
  },
};
