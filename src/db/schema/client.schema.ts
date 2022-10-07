import mongoose from 'mongoose';
import { GQL_Client } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IClient extends GQL_Client {}

const SchemaDef = new Schema<IClient>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    cid: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    phone: { type: String, require: true },
    blackListed: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const ClientSchema = model<IClient>('clients', SchemaDef);
