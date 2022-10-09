import { Env } from '../../config/env.js';
import { GQL_ReqError } from '../../generated-types/graphql.js';

export type GQL_Context = GraphQLModules.GlobalContext;

type ReqErrorConstructor = {
  message?: string;
  stack?: unknown;
  code?: string;
};

export class ReqError implements GQL_ReqError {
  constructor(arg?: ReqErrorConstructor) {
    this.message = arg?.message || 'Oops Something went wrong.';
    this.code = arg?.code || 'INTERNAL_SERVER_ERROR';
    if (Env.IS_DEV) this.stack = arg?.stack || null;
    else this.stack = null;
    this.__typename = 'ReqError';
  }

  message: string;
  code: string;
  stack: any;
  __typename: 'ReqError';
}

export const GQL_Paginate = `
  totalDocs: Int!
  limit: Int!
  page: Int!
  totalPages: Int!
  hasNextPage: Boolean
  nextPage: Int
  hasPrevPage: Boolean
  prevPage: Int
  pagingCounter: Int!
`;
