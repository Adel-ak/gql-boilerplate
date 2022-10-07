import mongoose from 'mongoose';
import { GQL_AppProperties, GQL_ERoles } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IAppProperties extends GQL_AppProperties {}

const SchemaDef = new Schema<IAppProperties>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    maxWishPerClient: { type: Number, require: true },
    roles: { type: [String], require: true, enum: GQL_ERoles },
    branches: { type: [{ code: String, name: String }], require: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const AppPropertiesSchema = model<IAppProperties>('appProperties', SchemaDef);
