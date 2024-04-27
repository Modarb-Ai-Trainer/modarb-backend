import joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ILogin {
  email: string;
  password: string;
}

export const loginValidationKeys = {
  email: joi
    .string()
    .required()
    .empty()
    .messages({
      "any.required": "email must be entered",
      "string.empty": "email can not be empty",
    }),
  password: joi.string().empty().required().messages({
    "string.base": "please enter a valid password",
    "any.required": "password must be entered",
    "string.empty": "password cannot be empty",
  }),
};

export const loginValidationSchema = createSchema<ILogin>(loginValidationKeys);
