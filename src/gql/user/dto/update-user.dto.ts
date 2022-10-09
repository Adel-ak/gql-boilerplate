import Joi from 'joi';
import { GQL_ERoles, GQL_StoreLocationInput, GQL_UpdateUserInput } from '../../../generated-types/graphql.js';
import { enumValues } from '../../../utils/index.js';
import { JoiIsObjectID, JoiNoSpace } from '../../../utils/joi.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const updateUserDtoV = (input: GQL_UpdateUserInput): Joi.ValidationResult => {
  const storeObj: Record<keyof GQL_StoreLocationInput, Joi.AnySchema<any>> = {
    code: Joi.string().required().label('Store code'),
    name: Joi.string().required().label('Store name'),
  };

  const joiObj: Record<keyof GQL_UpdateUserInput, Joi.AnySchema<any>> = {
    _id: Joi.string().custom(JoiIsObjectID).required().label('ID'),
    name: Joi.string().min(3).label('Name'),
    userName: Joi.string().custom(JoiNoSpace).label('User name'),
    password: Joi.string().min(8).label('Password'),
    role: Joi.string()

      .allow(...enumValues(GQL_ERoles))
      .label('Role'),
    store: Joi.object(storeObj).label('Store'),
    deactivated: Joi.boolean().label('Deactivated'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
