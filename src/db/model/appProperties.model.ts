import mongoose, { Document } from 'mongoose';
import { GQL_AppProperties, GQL_ERoles } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IAppProperties extends GQL_AppProperties {}

interface IAppPropertiesDocument extends IAppProperties, Omit<Document, '_id'> {}

const SchemaDef = new Schema<IAppPropertiesDocument>(
  {
    id: { type: Schema.Types.ObjectId, default: genDefaultID },
    maxWishPerClient: { type: Number, require: true },
    roles: { type: [String], require: true, enum: GQL_ERoles },
    stores: { type: [{ code: String, name: String }], require: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const AppPropertiesModel = model<IAppPropertiesDocument>('appProperties', SchemaDef);
