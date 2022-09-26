import Joi from 'joi';
import { ERoles, GQL_MutateUserInput } from '../../../generated-types/graphql.js';
import { EAccessPermissions } from '../../../shared/enums.js';
import { enumValues } from '../../../utils/index.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const createUserDtoV = (input: GQL_MutateUserInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_MutateUserInput, any> = {
    name: Joi.string().required().min(3).label('Name'),
    email: Joi.string().required().email().label('Email'),
    password: Joi.string().required().min(8).label('Password'),
    role: Joi.string()
      .required()
      .allow(...enumValues(ERoles))
      .label('Role'),
    permissions: Joi.array()
      .items(Joi.string().allow(...enumValues(EAccessPermissions)))
      .min(1)
      .label('permissions'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
