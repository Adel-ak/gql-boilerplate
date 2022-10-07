import mongoose from 'mongoose';
import { GQL_ERoles, GQL_User } from '../../generated-types/graphql.js';
import { genDefaultID, schemaDefaultOptions } from '../index.js';

const { Schema, model } = mongoose;

export interface IUser extends GQL_User {
  password: string;
}

const SchemaDef = new Schema<IUser>(
  {
    _id: { type: Schema.Types.ObjectId, default: genDefaultID },
    role: { type: String, required: true, enum: GQL_ERoles },
    name: { type: String, required: true },
    userName: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    _v: { type: Number, required: false, default: 0 },
  },
  schemaDefaultOptions,
);

export const UserSchema = model<IUser>('users', SchemaDef);
