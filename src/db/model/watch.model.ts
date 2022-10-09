import mongoose, { AggregatePaginateModel, PaginateModel, Document } from 'mongoose';
import { GQL_Watch } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

export interface IWatch extends GQL_Watch {}

interface IWatchDocument extends IWatch, Omit<Document, '_id'> {}

const SchemaDef = new Schema<IWatch>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    name: { type: String, require: true },
    code: { type: String, require: true, unique: true },
    disabled: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

SchemaDef.plugin(aggregatePaginate);
SchemaDef.plugin(mongoosePaginate);

type ModelPlugins = AggregatePaginateModel<IWatchDocument> & PaginateModel<IWatchDocument>;

export const WatchModel = model<IWatchDocument, ModelPlugins>('watches', SchemaDef);
