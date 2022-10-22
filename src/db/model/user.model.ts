import mongoose, { AggregatePaginateModel, Document, PaginateModel } from 'mongoose';
import { GQL_ERoles, GQL_User } from '../../generated-types/graphql.js';
import { genDefaultId, schemaDefaultOptions } from '../index.js';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema, model } = mongoose;

export interface IUser extends GQL_User {
  password: string;
}

interface IUserDocument extends IUser, Omit<Document, '_id'> {}

const SchemaDef = new Schema<IUserDocument>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultId },
    role: { type: String, required: true, enum: GQL_ERoles },
    name: { type: String, required: true },
    userName: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
    store: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

SchemaDef.plugin(mongooseAggregatePaginate);
SchemaDef.plugin(mongoosePaginate);

type ModelPlugins = AggregatePaginateModel<IUserDocument> & PaginateModel<IUserDocument>;

export const UserModel = model<IUserDocument, ModelPlugins>('users', SchemaDef);
