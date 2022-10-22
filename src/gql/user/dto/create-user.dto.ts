import Joi from 'joi';
import { GQL_ERoles, GQL_CreateUserInput } from '../../../generated-types/graphql.js';
import { enumValues } from '../../../utils/index.js';
import { JoiNoSpace } from '../../../utils/joi.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const createUserDtoV = (input: GQL_CreateUserInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_CreateUserInput, Joi.AnySchema<any>> = {
    name: Joi.string().required().min(3).label('Name'),
    userName: Joi.string().custom(JoiNoSpace).required().label('User name'),
    password: Joi.string().required().min(8).label('Password'),
    role: Joi.string()
      .required()
      .allow(...enumValues(GQL_ERoles))
      .label('Role'),
    store: Joi.string()
      .allow(null)
      .required()
      .when('role', {
        is: GQL_ERoles.Admin,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .label('Store'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
