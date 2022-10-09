import Joi from 'joi';
import { GQL_LoginInput } from '../../../generated-types/graphql.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const loginDtoV = (input: GQL_LoginInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_LoginInput, Joi.AnySchema<any>> = {
    userName: Joi.string().required().label('User name'),
    password: Joi.string().required().min(8).label('Password'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
