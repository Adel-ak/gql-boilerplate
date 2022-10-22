import Joi from 'joi';
import { GQL_CreateWishInput } from '../../../generated-types/graphql.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const createWishDtoV = (input: GQL_CreateWishInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_CreateWishInput, Joi.AnySchema<any>> = {
    clientCid: Joi.string().length(12).required().label('Client Civil ID'),
    watchCode: Joi.string().required().label('Watch Code'),
    store: Joi.string().required().label('Store'),
    expectedDate: Joi.date().allow(null).label('Expected date'),
    remark: Joi.string().allow('', null).label('Remark'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
