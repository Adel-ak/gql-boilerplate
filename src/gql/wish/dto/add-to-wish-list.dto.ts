import Joi from 'joi';
import { GQL_AddToWishListInput } from '../../../generated-types/graphql.js';
import { JoiIsObjectID } from '../../../utils/joi.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const addToWishListDtoV = (input: GQL_AddToWishListInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_AddToWishListInput, Joi.AnySchema<any>> = {
    client: Joi.custom(JoiIsObjectID).label('Client'),
    watch: Joi.custom(JoiIsObjectID).label('Watch'),
    remark: Joi.string().allow('', null).label('Remark'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
