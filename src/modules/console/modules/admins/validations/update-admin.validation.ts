import { Role } from "@common/enums/role.enum";
import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateAdmin {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  role?: Role;
  gender?: string;
}

export const updateAdminSchema = createSchema<IUpdateAdmin>({
  name: joi.string().empty().optional().messages({
    "string.base": "please enter a valid name",
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
  password: joi.string().empty().min(8).optional().messages({
    "string.base": "please enter a valid password",
    "string.empty": "password cannot be empty",
    "string.min": "password must be at least 8 characters",
  }),
  image: joi.string().empty().optional().messages({
    "string.base": "please enter a valid image",
    "string.empty": "image cannot be empty",
  }),
  role: joi
    .string()
    .valid(...Object.values(Role))
    .optional()
    .messages({
      "string.base": "please enter a valid role",
      "string.empty": "role cannot be empty",
    }),
  gender: joi.string().empty().optional().messages({
    "string.base": "please enter a valid gender",
    "string.empty": "gender cannot be empty",
  }),
});
