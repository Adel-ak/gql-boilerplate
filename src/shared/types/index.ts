import { DecodedIdToken } from 'firebase-admin/auth';
import { ERoles } from '../enums.js';
import { GQL_FieldsError, GQL_ReqError, Maybe } from '../../generated-types/graphql.js';
import Upload from 'graphql-upload/Upload.mjs';
import { Env } from '../../config/env.js';

export type NotArray<T> = T extends Array<unknown> ? never : T;

export type AuthUser = DecodedIdToken & {
  role: ERoles;
  permissions: [];
};

export type GoResponse<R = any, E = any> = Promise<[Maybe<R>, Maybe<E>]>;

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

export type TAwsUpload = {
  file: Upload;
  fileName?: string;
  path?: string;
  ACL?:
    | 'private'
    | 'public-read'
    | 'public-read-write'
    | 'aws-exec-read'
    | 'authenticated-read'
    | 'bucket-owner-read'
    | 'bucket-owner-full-control'
    | 'log-delivery-write';
};

export enum EValidFileMimeType {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
}

export enum EValidFileExtension {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
}
