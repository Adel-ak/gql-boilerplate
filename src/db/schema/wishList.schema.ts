import mongoose from 'mongoose';
import { GQL_WishList } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IWishList extends GQL_WishList {}

const SchemaDef = new Schema<IWishList>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    clientID: { type: Schema.Types.ObjectId, require: true },
    clientCid: { type: String, require: true },
    clientName: { type: String, require: true },
    clientPhone: { type: String, require: true },
    itemID: { type: Schema.Types.ObjectId, require: true },
    itemName: { type: String, require: true },
    itemCode: { type: String, require: true },
    branch: { type: { code: String, name: String }, require: true },
    remark: { type: String, require: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const WishListSchema = model<IWishList>('wishLists', SchemaDef);
