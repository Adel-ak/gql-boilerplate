import { ValidationError, ValidationErrorItem } from 'joi';
import mongoose from 'mongoose';
import { errorsMessages } from '../constants/errors.js';
import { GQL_FieldError, GQL_FieldErrors } from '../generated-types/graphql.js';
import { FieldErrors } from '../shared/types/gql.type.js';

import { __dirname } from './path.js';

const { Types } = mongoose;

/**
 * Wait returns a promise that resolves after a given number of seconds.
 * @param [sec=1] - The number of seconds to wait.
 */
export const wait = async (sec = 1) => new Promise<void>((res) => setTimeout(res, sec * 1000));

/**
 * Return a random number between min and max, inclusive.
 * @param [min=1] - The minimum number that can be returned.
 * @param [max=5] - The maximum number to return.
 */
export const randNum = (min = 1, max = 5) => Math.floor(Math.random() * (max - min + 1)) + min;

export const enumValues = <T = string>(e: any): T[] => {
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

export const toObjId = (id: string): mongoose.Types.ObjectId | null => {
  if (isValidObjectId(id)) {
    return new Types.ObjectId(id);
  }
  return null;
};

export const isValidObjectId = (value: any) => Types.ObjectId.isValid(value);

export const createMongoDuplicateFieldErrors = (err: any): GQL_FieldErrors => {
  const fe = new FieldErrors();

  for (let key in err['keyPattern']) {
    fe.fieldErrors.push({
      field: key,
      message: errorsMessages.inUse[key] || `${key} is in use by another user.`,
    });
  }

  return fe;
};

export const getMongoIndexName = (message: string) => {
  let field: string = message.split('index: ')[1];
  field = field.split(' dup key')[0];
  return field;
};
