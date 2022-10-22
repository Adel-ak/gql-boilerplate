import mongoose, { AggregatePaginateModel, Document, PaginateModel } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { GQL_EWishStatus, GQL_Wish, GQL_WishStatusHistory } from '../../generated-types/graphql.js';
import { genDefaultId, schemaDefaultOptions } from '../index.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

export type IWish = GQL_Wish;

export interface IWishDocument extends IWish, Omit<Document, '_id'> {}

interface IWishStatusHistoryDocument extends GQL_WishStatusHistory, Document {}

const SchemaWishStatusHistoryDef = new Schema<IWishStatusHistoryDocument>(
  {
    status: { type: String, enum: GQL_EWishStatus, require: true },
    user: { type: Schema.Types.ObjectId, require: true },
    at: { type: Date },
  },
  { timestamps: false, _id: false },
);

const SchemaDef = new Schema<IWishDocument>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultId },
    clientId: { type: Schema.Types.ObjectId, require: true, index: true },
    clientName: { type: String, required: true },
    clientCid: { type: String, required: true, index: true },
    clientPhone: { type: String, required: true },
    watchId: { type: Schema.Types.ObjectId, require: true, index: true },
    watchCode: { type: String, require: true, index: true },
    watchName: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, require: true },
    store: { type: String, require: true, index: true },
    expectedDate: { type: Date },
    remark: { type: String, require: true },
    status: { type: String, enum: GQL_EWishStatus, require: true, index: true },
    statusHistory: { type: [SchemaWishStatusHistoryDef], require: true },
    createdAt: { type: Date, index: true },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

SchemaDef.plugin(mongooseAggregatePaginate);
SchemaDef.plugin(mongoosePaginate);

type ModelPlugins = AggregatePaginateModel<IWishDocument> & PaginateModel<IWishDocument>;

export const WishModel = model<IWishDocument, ModelPlugins>('wishes', SchemaDef);
