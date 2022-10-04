import { Types } from 'mongoose';
import { Maybe } from '../../generated-types/graphql.js';

export type TObjectId = Types.ObjectId;

export type NotArray<T> = T extends Array<unknown> ? never : T;

export interface ISessionInfo {
  ip: string | null;
  userAgent: string | null;
}

export type GoResponse<R = any, E = any> = Promise<[Maybe<R>, Maybe<E>]>;
