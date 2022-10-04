import mongoose from 'mongoose';
import dayjs from 'dayjs';
import { ERoles } from '../../shared/enums.js';
import { TObjectId } from '../../shared/types/index.js';

const { Schema, model, Types } = mongoose;

export interface ISession {
  _id: TObjectId;
  userID: TObjectId;
  userRole: string;
  token: string;
  valid: boolean;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  updatedAt: Date;
  _v: number;
}

const SchemaDef = new Schema<ISession>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    userID: {
      type: Schema.Types.ObjectId,
      require: true,
      index: true,
    },
    userRole: { type: String, require: true, enum: ERoles },
    token: { type: String, require: true, index: true },
    valid: { type: Boolean, default: true },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
    createdAt: { type: Date, default: () => dayjs().utc().toDate() },
    // expires in 15 days
    updatedAt: { type: Date, default: null, expires: 60 * 60 * 24 * 15 },
    _v: { type: Number, required: false, default: 0 },
  },
  {
    timestamps: true,
    versionKey: '_v',
  },
);

export const SessionSchema = model<ISession>('sessions', SchemaDef);
