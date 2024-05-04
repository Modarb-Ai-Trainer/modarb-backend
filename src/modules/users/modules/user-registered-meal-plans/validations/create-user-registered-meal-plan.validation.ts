import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ICreateUserRegisteredMealPlan {
  user: string;
  isActive?: boolean;
  meal_plan: string;
  days: {
    day_number: number;
    meals: string[];
    is_eaten?: boolean;
  }[];
}


export const CreateUserRegisteredMealPlanKeys = {
  user: joi.string().empty().required().messages({
    "string.base": "please enter a valid user",
    "any.required": "user is required",
    "string.empty": "user can not be empty",
  }),
  isActive: joi.boolean().empty().optional().messages({
    "boolean.base": "please enter a valid isActive",
    "boolean.empty": "isActive can not be empty",
  }),
  meal_plan: joi.string().empty().required().messages({
    "string.base": "please enter a valid meal_plan",
    "any.required": "meal_plan is required",
    "string.empty": "meal_plan can not be empty",
  }),
  days: joi.array().required().items(
    joi.object({
      day_number: joi.number().empty().required().messages({
        "number.base": "please enter a valid day_number",
        "any.required": "day_number is required",
        "number.empty": "day_number can not be empty",
      }),
      meals: joi.array().items(
        joi.string().empty().required().messages({
          "string.base": "please enter a valid meals",
          "any.required": "meals is required",
          "string.empty": "meals can not be empty",
        })
      ),
      is_eaten: joi.boolean().empty().optional().messages({
        "boolean.base": "please enter a valid is_eaten",
        "boolean.empty": "is_eaten can not be empty",
      }),
    }).required().empty().messages({
      "any.required": "days is required",
      "object.empty": "days can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid days",
    "any.required": "days is required",
    "array.empty": "days can not be empty",
  }),



};

export const CreateUserRegisteredMealPlan = createSchema<ICreateUserRegisteredMealPlan>(CreateUserRegisteredMealPlanKeys);
