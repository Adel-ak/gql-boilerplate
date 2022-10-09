import { ValidationError, ValidationErrorItem } from 'joi';
import mongoose from 'mongoose';
import { GQL_FieldError, GQL_FieldErrors } from '../generated-types/graphql.js';

import { __dirname } from './path.js';

const { Types } = mongoose;

/**
 * Return a random number between min and max, inclusive.
 * @param [min=1] - The minimum number that can be returned.
 * @param [max=5] - The maximum number to return.
 */
export const randNum = (min = 1, max = 5) => Math.floor(Math.random() * (max - min + 1)) + min;

export const enumValues = <T extends string | number>(e: any): T[] => {
  return typeof e === 'object' ? Object.values(e) : [];
};

export const toFieldErrors = (error: ValidationError): GQL_FieldErrors => {
  const fieldErrors = error.details.map<GQL_FieldError>((err: ValidationErrorItem) => {
    const message = err.message;
    const field = err.path.join('.');
    return {
      field,
      message,
    };
  });
  return {
    fieldErrors,
    __typename: 'FieldErrors',
  };
};

export const toObjID = (id: string): mongoose.Types.ObjectId | null => {
  if (isValidObjectID(id)) {
    return new Types.ObjectId(id);
  }
  return null;
};

export const isValidObjectID = (value: any) => Types.ObjectId.isValid(value);
