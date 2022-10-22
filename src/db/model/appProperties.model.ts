import mongoose, { Document } from 'mongoose';
import { GQL_AppProperties, GQL_ERoles } from '../../generated-types/graphql.js';
import { TObjectId } from '../../shared/types/index.js';
import { genDefaultId, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IAppProperties extends GQL_AppProperties {
  _id: TObjectId;
  createdAt: Date;
  updatedAt: Date;
  _v: number;
}

interface IAppPropertiesDocument extends IAppProperties, Omit<Document, '_id'> {}

const SchemaDef = new Schema<IAppPropertiesDocument>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultId },
    maxWishPerClient: { type: Number, require: true },
    roles: { type: [String], require: true, enum: GQL_ERoles },
    stores: { type: [String], require: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const AppPropertiesModel = model<IAppPropertiesDocument>('appProperties', SchemaDef);
