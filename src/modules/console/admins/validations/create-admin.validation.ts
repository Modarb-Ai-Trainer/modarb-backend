import * as joi from "joi";
import { Role } from "../enums/roles.enum";

export const createAdminSchema = joi
  .object()
  .required()
  .keys({
    name: joi.string().empty().required().messages({
      "string.base": "please enter a valid name",
      "any.required": "name is required",
      "string.empty": "name can not be empty",
    }),
    email: joi
      .string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "eg", "io"] },
      })
      .empty()
      .messages({
        "string.email": "please enter a valid email",
        "any.required": "email must be entered",
        "string.empty": "email can not be empty",
      }),
    password: joi.string().empty().min(8).required().messages({
      "string.base": "please enter a valid password",
      "any.required": "password must be entered",
      "string.empty": "password cannot be empty",
      "string.min": "password must be at least 8 characters",
    }),
    dob: joi.date().empty().optional().messages({
      "date.base": "please enter a valid date",
    }),
    role: joi
      .string()
      .valid(...Object.values(Role))
      .required(),
    gender: joi.string().empty().required(),
  });
