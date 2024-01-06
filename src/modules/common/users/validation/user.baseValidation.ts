import joi from "joi";

export const userRegisterValidation = joi
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
    confirmPassword: joi.string().empty().min(8).required().messages({
      "string.base": "please enter a valid password",
      "any.required": "password must be entered",
      "string.empty": "password cannot be empty",
      "string.min": "password must be at least 8 characters",
    }),
    image: joi
      .object()
      .optional()
      .keys({
        url: joi.string().optional().messages({
          "string.base": "please enter a valid url",
        }),
        public_id: joi.string().optional().messages({
          "string.base": "please enter a valid public_id",
        }),
      }),
    gender: joi.string().empty().required().messages({
      "string.base": "please enter a valid gender",
      "any.required": "gender must be entered",
      "string.empty": "gender cannot be empty",
    }),
    height: joi.number().empty().required().messages({
      "number.base": "please enter a valid height number",
      "any.required": "height must be entered",
      "number.empty": "height cannot be empty",
    }),
    weight: joi.number().empty().required().messages({
      "number.base": "please enter a valid weight number",
      "any.required": "weight must be entered",
      "number.empty": "weight cannot be empty",
    }),
    fitness_level: joi.string().empty().required().messages({
      "string.base": "please enter a valid fitness_level",
      "any.required": "fitness_level must be entered",
      "string.empty": "fitness_level cannot be empty",
    }),
    preferences: joi
      .object()
      .optional()
      .keys({
        fitness_goal: joi.string().empty().required().messages({
          "string.base": "please enter a valid fitness_goal",
          "any.required": "fitness_goal must be entered",
          "string.empty": "fitness_goal cannot be empty",
        }),
        target_weight: joi.number().empty().required().messages({
          "number.base": "please enter a valid target_weight number",
          "any.required": "target_weight must be entered",
          "number.empty": "target_weight cannot be empty",
        }),
        workout_frequency: joi.number().empty().required().messages({
          "number.base": "please enter a valid workout_frequency number",
          "any.required": "workout_frequency must be entered",
          "number.empty": "workout_frequency cannot be empty",
        }),
        preferred_days: joi
          .array()
          .empty()
          .required()
          .items(
            joi.string().empty().required().messages({
              "string.base": "please enter a valid preferred_days",
              "any.required": "preferred_days must be entered",
              "string.empty": "preferred_days cannot be empty",
            })
          ),
        workout_place: joi.string().empty().required().messages({
          "string.base": "please enter a valid workout_place",
          "any.required": "workout_place must be entered",
          "string.empty": "workout_place cannot be empty",
        }),
        preferred_equipment: joi
          .array()
          .empty()
          .required()
          .items(
            joi.string().empty().required().messages({
              "string.base": "please enter a valid preferred_equipment",
              "any.required": "preferred_equipment must be entered",
              "string.empty": "preferred_equipment cannot be empty",
            })
          ),
      }),
    injuries: joi
      .array()
      .empty()
      .required()
      .items(
        joi.string().empty().required().messages({
          "string.base": "please enter a valid injuries",
          "any.required": "injuries must be entered",
          "string.empty": "injuries cannot be empty",
        })
      ),
    dob: joi.date().empty().optional().messages({
      "date.base": "please enter a valid date",
    }),
  });
