import mongoose from 'mongoose';
import dayjs from 'dayjs';

const { Schema, model, Types } = mongoose;

const SchemaDef = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: false },
    disabled: { type: Boolean, required: true, default: false },
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

export const UserSchema = model('users', SchemaDef);
