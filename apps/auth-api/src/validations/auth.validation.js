import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),

  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .allow(null, ""),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});