import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateUserRegisteredMealPlan {
  user?: string;
  isActive?: boolean;
  meal_plan?: string;
  days?: {
    day_number?: number;
    meals?: string[];
    is_eaten?: boolean;
  }[];
}

export const UpdateUserRegisteredMealPlanKeys = {
  user: joi.string().empty().optional().messages({
    "string.base": "please enter a valid user",
    "string.empty": "user can not be empty",
  }),
  isActive: joi.boolean().empty().optional().messages({
    "boolean.base": "please enter a valid isActive",
    "boolean.empty": "isActive can not be empty",
  }),
  meal_plan: joi.string().empty().optional().messages({
    "string.base": "please enter a valid meal_plan",
    "string.empty": "meal_plan can not be empty",
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
      is_eaten: joi.boolean().empty().optional().messages({
        "boolean.base": "please enter a valid is_eaten",
        "boolean.empty": "is_eaten can not be empty",
      }),
    }).optional().empty().messages({
      "object.empty": "days can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid days",
    "array.empty": "days can not be empty",
  }),

};

export const UpdateUserRegisteredMealPlan = createSchema<IUpdateUserRegisteredMealPlan>(UpdateUserRegisteredMealPlanKeys);
