import Joi, { CustomHelpers, ValidationResult } from 'joi';
import mongoose from 'mongoose';

const { Types } = mongoose;
const options = { abortEarly: false, errors: { wrap: { label: '' } }, allowUnknown: true };

export const JoiIsObjectID = (value: string, helper: CustomHelpers) => {
  const isValid = Types.ObjectId.isValid(value);

  if (!isValid) {
    const label_flags = helper.schema._flags.label || '';
    const label = label_flags ? `${label_flags} is a` : '';
    return helper.message({ custom: `${label} Invalid ObjectID.` });
  }

  return value;
};

export const JoiNoSpace = (value: string, helper: CustomHelpers) => {
  var regex = /\s/;

  if (regex.test(value)) {
    const label_flags = helper.schema._flags.label || '';
    const label = label_flags ? `${label_flags}` : '';
    return helper.message({ custom: `${label} should not contain whitespace.` });
  }

  return value;
};

export const validateObjectID = (id: string): ValidationResult => {
  const joiObj = {
    id: Joi.custom(JoiIsObjectID).required().label('ID'),
  };

  return Joi.object(joiObj).validate({ id }, { ...options });
};
