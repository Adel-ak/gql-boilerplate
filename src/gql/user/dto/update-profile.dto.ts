import Joi from 'joi';
import { GQL_UpdateProfileInput } from '../../../generated-types/graphql.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const updateProfileDtoV = (input: GQL_UpdateProfileInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_UpdateProfileInput, Joi.AnySchema<any>> = {
    userName: Joi.string().required().label('User name'),
    password: Joi.string().required().min(8).label('Password'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
