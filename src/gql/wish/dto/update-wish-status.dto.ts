import Joi from 'joi';
import { GQL_EWishStatus, GQL_UpdateWishStatusInput } from '../../../generated-types/graphql.js';
import { enumValues } from '../../../utils/index.js';
import { JoiIsObjectId } from '../../../utils/joi.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const updateWishStatusDtoV = (input: GQL_UpdateWishStatusInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_UpdateWishStatusInput, Joi.AnySchema<any>> = {
    _id: Joi.custom(JoiIsObjectId).required().label('ID'),
    status: Joi.string()
      .allow(...enumValues(GQL_EWishStatus))
      .required()
      .label('Status'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
