import { AuthenticatableType } from "@common/enums/authenticatable-type.enum";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Gender } from "@common/enums/gender.enum";
import { Injury } from "@common/enums/injury.enum";
import { PreferredDay } from "@common/enums/preferred-day.enum";
import { PreferredEquipment } from "@common/enums/preferred-equipment.enum";
import { WorkoutPlace } from "@common/enums/workout-place.enum";
import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: {
    url: string;
    public_id: string;
  };
  gender: string;
  height: number;
  weight: number;
  fitness_level: string;
  preferences?: {
    fitness_goal: string;
    target_weight: number;
    workout_frequency: number;
    preferred_days: string[];
    workout_place: string;
    preferred_equipment: string[];
  };
  injuries: string[];
  dob?: Date;
}

export const userRegisterKeys = {
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
  gender: joi
    .string()
    .valid(...Object.values(Gender))
    .empty()
    .required()
    .messages({
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
  fitness_level: joi
    .string()
    .valid(...Object.values(FitnessLevel))
    .empty()
    .required()
    .messages({
      "string.base": "please enter a valid fitness_level",
      "any.required": "fitness_level must be entered",
      "string.empty": "fitness_level cannot be empty",
    }),
  preferences: joi
    .object()
    .optional()
    .keys({
      fitness_goal: joi
        .string()
        .valid(...Object.values(FitnessGoal))
        .empty()
        .required()
        .messages({
          "string.base": "please enter a valid fitness_goal",
          "any.required": "fitness_goal must be entered",
          "string.empty": "fitness_goal cannot be empty",
        }),
      target_weight: joi.number().empty().required().messages({
        "number.base": "please enter a valid target_weight number",
        "any.required": "target_weight must be entered",
        "number.empty": "target_weight cannot be empty",
      }),
      workout_frequency: joi.number().empty().optional().messages({
        "number.base": "please enter a valid workout_frequency number",
        "number.empty": "workout_frequency cannot be empty",
      }),
      preferred_days: joi
        .array()
        .empty()
        .optional()
        .items(
          joi.string().valid(...Object.values(PreferredDay))
            .empty().required().messages({
              "string.base": "please enter a valid preferred_days",
              "any.required": "preferred_days must be entered",
              "string.empty": "preferred_days cannot be empty",
            })
        ),
      workout_place: joi
        .string()
        .valid(...Object.values(WorkoutPlace))
        .empty()
        .required()
        .messages({
          "string.base": "please enter a valid workout_place",
          "any.required": "workout_place must be entered",
          "string.empty": "workout_place cannot be empty",
        }),
      preferred_equipment: joi
        .array()
        .empty()
        .required()
        .items(
          joi.string().valid(...Object.values(PreferredEquipment))
            .empty().required().messages({
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
      joi.string().valid(...Object.values(Injury))
        .empty().required().messages({
          "string.base": "please enter a valid injuries",
          "any.required": "injuries must be entered",
          "string.empty": "injuries cannot be empty",
        })
    ),
  dob: joi.date().empty().optional().messages({
    "date.base": "please enter a valid date",
  }),
  role: joi
    .string()
    .valid(...Object.values(AuthenticatableType))
    .optional()
    .messages({
      "string.base": "please enter a valid role",
      "string.empty": "role cannot be empty",
    }),
};

export const userRegisterSchema = createSchema<IUserRegister>(userRegisterKeys);
