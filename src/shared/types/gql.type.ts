import { Env } from '../../config/env.js';
import { GQL_FieldsError, GQL_ReqError, Maybe } from '../../generated-types/graphql.js';

export type GQL_Context = GraphQLModules.GlobalContext;

type ReqErrorConstructor = {
  message?: string;
  stack?: unknown;
};

export class ReqError implements GQL_ReqError {
  constructor(arg?: ReqErrorConstructor) {
    this.message = arg?.message || 'Oops Something went wrong.';
    if (Env.IS_DEV) this.stack = arg?.stack || null;
    else this.stack = null;
    this.__typename = 'ReqError';
  }

  message: string;
  stack: any;
  __typename: 'ReqError';
}

export type GqlResultConstructor<T> = {
  success: boolean;
  error?: Maybe<GQL_ReqError | GQL_FieldsError>;
  data?: Maybe<T>;
};

export class GqlResult<T = any> {
  success: boolean;
  error?: Maybe<GQL_ReqError | GQL_FieldsError>;
  data?: Maybe<T>;

  constructor(arg: GqlResultConstructor<T>) {
    this.success = arg.success;
    this.error = arg.error || null;
    this.data = arg.data || null;
  }
}
