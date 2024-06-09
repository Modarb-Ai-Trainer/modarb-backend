import { FitnessLevel } from "@common/enums/fitness-level.enum";
import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { UpdateUserRegisteredMealPlan } from "modules/users/modules/user-registered-meal-plans/validations/update-user-registered-meal-plan.validation";

export interface IUpdateMealPlan {
  image?: string;
  description?: string;
  duration?: number;
  level?: FitnessLevel;
  your_journey?: string;
  key_features?: {
    title?: string;
    description?: string;
  }[];
  days?: {
    day_number?: number;
    meals?: string[];
  }[];
}

export const UpdateMealPlanKeys = {
  image: joi.string().empty().optional().messages({
    "string.base": "please enter a valid image",
    "any.required": "image is required",
    "string.empty": "image can not be empty",
  }),
  description: joi.string().empty().optional().messages({
    "string.base": "please enter a valid description",
    "any.required": "description is required",
    "string.empty": "description can not be empty",
  }),
  duration: joi.number().empty().optional().messages({
    "number.base": "please enter a valid Duration",
    "any.required": "Duration is required",
    "number.empty": "Duration can not be empty",
  }),
  level: joi.string().empty().optional().messages({
    "string.base": "please enter a valid Level",
    "any.required": "Level is required",
    "string.empty": "Level can not be empty",
  }),
  your_journey: joi.string().empty().optional().messages({
    "string.base": "please enter a valid your_Journey",
    "any.required": "your_Journey is required",
    "string.empty": "your_Journey can not be empty",
  }),
  key_features: joi.array().optional().items(
    joi.object({
      title: joi.string().empty().optional().messages({
        "string.base": "please enter a valid title",
        "string.empty": "title can not be empty",
      }),
      description: joi.string().empty().optional().messages({
        "string.base": "please enter a valid description",
        "string.empty": "description can not be empty",
      }),
    }).optional().empty().messages({
      "object.empty": "key_Features can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid key_Features",
    "array.empty": "key_Features can not be empty",
  }),
  days: joi.array().optional().items(
    joi.object({
      day_number: joi.number().empty().optional().messages({
        "number.base": "please enter a valid day_number",
        "number.empty": "day_number can not be empty",
      }),
      meals: joi.array().items(
        joi.string().empty().optional().messages({
          "string.base": "please enter a valid meals",
          "string.empty": "meals can not be empty",
        })
      ),
    }).optional().messages({
      "object.empty": "days can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid days",
    "array.empty": "days can not be empty",
  }),


  
};

export const UpdateMealPlan = createSchema<IUpdateMealPlan>(UpdateMealPlanKeys);
