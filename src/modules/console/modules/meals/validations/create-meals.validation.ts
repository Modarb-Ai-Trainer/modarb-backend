import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { MealType } from "@common/enums/meal-type.enum";

export interface ICreateMeal {
  name: string;
  created_at?: Date;
  image: string;
  ingredients: string[];
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  type: MealType;
}

export const createMealSchema = createSchema<ICreateMeal>({
  name: joi.string().empty().required().messages({
    "string.base": "please enter a valid name",
    "any.required": "name is required",
    "string.empty": "name can not be empty",
  }),
  created_at: joi.date().empty().optional().messages({
    "date.base": "please enter a valid created_at",
    "date.empty": "created_at can not be empty",
  }),

  image: joi.string().empty().required().messages({
    "string.base": "please enter a valid image",
    "any.required": "image is required",
    "string.empty": "image can not be empty",
  }),

  calories: joi.number().empty().required().messages({
    "number.base": "please enter a valid calories",
    "any.required": "calories is required",
    "number.empty": "calories can not be empty",
  }),
  ingredients: joi.array().items(joi.string()).required().messages({
    "array.base": "please enter a valid ingredients",
    "any.required": "ingredients is required",
  }),
  carbs: joi.number().empty().required().messages({
    "number.base": "please enter a valid carbs",
    "any.required": "carbs is required",
    "number.empty": "carbs can not be empty",
  }),
  proteins: joi.number().empty().required().messages({
    "number.base": "please enter a valid proteins",
    "any.required": "proteins is required",
    "number.empty": "proteins can not be empty",
  }),
  fats: joi.number().empty().required().messages({
    "number.base": "please enter a valid fats",
    "any.required": "fats is required",
    "number.empty": "fats can not be empty",
  }),
  type: joi.string().empty().required().messages({
    "string.base": "please enter a valid type",
    "any.required": "type is required",
    "string.empty": "type can not be empty",
  }),

});
