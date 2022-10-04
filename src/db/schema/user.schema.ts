import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { ERoles, GQL_User } from '../../generated-types/graphql.js';

const { Schema, model, Types } = mongoose;

export interface IUser extends GQL_User {
  password: string;
}

const SchemaDef = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    role: { type: String, required: true, enum: ERoles },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: false, unique: false },
    password: { type: String, required: true },
    deactivated: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => dayjs().toDate() },
    updatedAt: { type: Date, default: null },
    _v: { type: Number, required: false, default: 0 },
  },
  {
    versionKey: '_v',
    timestamps: true,
  },
);

export const UserSchema = model<IUser>('users', SchemaDef);
