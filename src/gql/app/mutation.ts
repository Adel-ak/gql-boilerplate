import { GQL_MutationResolvers } from '../../generated-types/graphql.js';

export const Mutation: GQL_MutationResolvers = {
  _empty: (_, __, ctx) => {
    const authUser = ctx.authUser;

    ctx.log = {
      user: authUser?.name,
      role: authUser?.role,
      action: `updated document`,
      msg: 'blah blah blah',
    };
    return 'Hi mom.';
  },
};
