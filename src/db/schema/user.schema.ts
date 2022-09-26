import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { GQL_User } from '../../generated-types/graphql.js';

const { Schema, model, Types } = mongoose;

const SchemaDef = new Schema<GQL_User>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    permissions: { type: [String], require: true },
    createdAt: { type: Date, default: () => dayjs().toDate() },
    updatedAt: { type: Date, default: null },
    _v: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
    versionKey: '_v',
  },
);

export const UserSchema = model<GQL_User>('users', SchemaDef);
