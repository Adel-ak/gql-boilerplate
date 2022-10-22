import Upload from 'graphql-upload/Upload.mjs';
import { TObjectId } from './types/index.js';
import { GraphQLScalarType, Kind } from 'graphql';

export type CustomScalars = {
  Date: Date;
  DateTime: Date;
  JSON: string;
  ObjectID: TObjectId;
  UUID: string | number;
  Upload: Upload;
};

export const JSONScalarType = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary json',
  parseValue: (value) => {
    return typeof value === 'object' ? value : typeof value === 'string' ? JSON.parse(value) : null;
  },
  serialize: (value) => {
    return typeof value === 'object' ? value : typeof value === 'string' ? JSON.parse(value) : null;
  },
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        throw new Error(`Not sure what to do with JSON for JSONScalarType`);
      default:
        return null;
    }
  },
});
