import Upload from 'graphql-upload/Upload.mjs';
import { TObjectId } from './types/index.js';

export type CustomScalars = {
  Date: Date;
  DateTime: Date;
  EmailAddress: string;
  JSON: string;
  ObjectID: TObjectId;
  UUID: string | number;
  Upload: Upload;
};
