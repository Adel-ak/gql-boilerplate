import { Types } from 'mongoose';
import Upload from 'graphql-upload/Upload.mjs';

type GQL_ObjectID = Types.ObjectId;

export type CustomScalars = {
  Date: Date;
  DateTime: Date;
  EmailAddress: string;
  JSON: string;
  ObjectID: GQL_ObjectID;
  UUID: string | number;
  Upload: Upload;
};
