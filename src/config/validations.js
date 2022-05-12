import Joi from 'joi';

export const validation_schema = Joi.object({
  username: Joi.number().min(8).required(),
});
