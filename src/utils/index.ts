import { ValidationError, ValidationErrorItem } from 'joi';
import mongoose from 'mongoose';
import { GqlResult } from '../shared/types/index.js';

const { Types } = mongoose;

export const enumValues = <T extends string | number>(e: any): T[] => {
  return typeof e === 'object' ? Object.values(e) : [];
};

export const toResultFieldsError = (error: ValidationError): GqlResult => {
  const fields = error.details.map((err: ValidationErrorItem) => {
    const message = err.message;
    const field = err.path.join('.');
    return {
      field,
      message,
    };
  });
  return new GqlResult({
    success: false,
    error: {
      message: `One or more fields are invalid.`,
      fields: fields,
      __typename: 'FieldsError',
    },
  });
};

export const toObjID = (id: string): mongoose.Types.ObjectId | null => {
  const isValid = Types.ObjectId.isValid(id);
  if (isValid) {
    return new Types.ObjectId(id);
  }
  return null;
};
