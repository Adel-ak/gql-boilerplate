import Joi from 'joi';
import { GQL_RefreshSessionInput } from '../../../generated-types/graphql.js';

const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const refreshTokensDtoV = (input: GQL_RefreshSessionInput): Joi.ValidationResult => {
  const joiObj: Record<keyof GQL_RefreshSessionInput, Joi.AnySchema<any>> = {
    accessToken: Joi.string().required().label('Access Token'),
    refreshToken: Joi.string().required().label('Refresh Token'),
  };

  return Joi.object(joiObj).validate(input, { ...options });
};
