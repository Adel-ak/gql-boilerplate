import mongoose from 'mongoose';
import { Env } from '../../config/env.js';
import { GQL_ERoles } from '../../generated-types/graphql.js';
import { TObjectId } from '../../shared/types/index.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;
const { SESSION_EXPIRY } = Env;

export interface ISession {
  _id: TObjectId;
  userID: TObjectId;
  userRole: string;
  token: string;
  valid: boolean;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  updatedAt: Date;
  _v: number;
}

const SchemaDef = new Schema<ISession>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    userID: { type: Schema.Types.ObjectId, require: true, index: true },
    userRole: { type: String, require: true, enum: GQL_ERoles },
    token: { type: String, require: true, index: true },
    valid: { type: Boolean, default: true },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
    createdAt: { type: Date },
    updatedAt: { type: Date, expires: SESSION_EXPIRY },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const SessionModel = model<ISession>('sessions', SchemaDef);
