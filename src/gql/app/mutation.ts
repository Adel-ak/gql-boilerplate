import { GQL_MutationResolvers } from '../../generated-types/graphql.js';

export const Mutation: GQL_MutationResolvers = {
  _empty: (_, __, ctx) => {
    ctx.log = {
      user: 'ADEL',
      action: `updated document`,
      msg: 'blah blah blah',
    };
    return 'Hi mom.';
  },
};
