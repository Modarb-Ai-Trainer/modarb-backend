import joi from "joi";

export const loginValidation = joi
  .object()
  .required()
  .keys({
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
  });
