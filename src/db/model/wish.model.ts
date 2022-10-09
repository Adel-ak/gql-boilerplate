import mongoose, { AggregatePaginateModel, Document, PaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { GQL_Wish } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

export interface IWish extends GQL_Wish {}

interface IWishDocument extends IWish, Omit<Document, '_id'> {}

const SchemaDef = new Schema<IWishDocument>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    client: { type: Schema.Types.ObjectId, require: true },
    watch: { type: Schema.Types.ObjectId, require: true },
    createdBy: { type: Schema.Types.ObjectId, require: true },
    store: { type: { code: String, name: String }, require: true },
    remark: { type: String, require: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

SchemaDef.plugin(mongooseAggregatePaginate);
SchemaDef.plugin(mongoosePaginate);

type ModelPlugins = AggregatePaginateModel<IWishDocument> & PaginateModel<IWishDocument>;

export const WishModel = model<IWishDocument, ModelPlugins>('wishes', SchemaDef);
