import Joi from 'joi';
import { GQL_ERoles, GQL_UpdateUserInput } from '../../../generated-types/graphql.js';
import { enumValues } from '../../../utils/index.js';
import { JoiIsObjectId, JoiNoSpace } from '../../../utils/joi.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const updateUserDtoV = (input: GQL_UpdateUserInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_UpdateUserInput, Joi.AnySchema<any>> = {
    _id: Joi.string().custom(JoiIsObjectId).required().label('ID'),
    name: Joi.string().required().min(3).label('Name'),
    userName: Joi.string().required().custom(JoiNoSpace).label('User name'),
    password: Joi.string().allow('').min(8).label('Password'),
    role: Joi.string()
      .required()
      .allow(...enumValues(GQL_ERoles))
      .label('Role'),
    store: Joi.string()
      .required()
      .allow(null)
      .when('role', {
        is: GQL_ERoles.Admin,
        then: Joi.optional(),
        otherwise: Joi.required(),
      })
      .label('Store'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
