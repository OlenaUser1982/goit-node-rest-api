import Joi from "joi";

export const createAndLoginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export const verifyEmailUserSchema = Joi.object({
  email: Joi.string().required(),
});
