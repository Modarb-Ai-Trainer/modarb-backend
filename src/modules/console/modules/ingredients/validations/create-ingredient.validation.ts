import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { MealType } from "@common/enums/meal-type.enum";


export interface ICreateIngredients {
  name: string;
  serving_size: number;
  servings_count: number;
  serving_size_unit: string;
  servings_count_unit: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
}

export const createIngredientsSchema = createSchema<ICreateIngredients>({
  name: joi.string().empty().required().messages({
    "string.base": "please enter a valid name",
    "any.required": "name is required",
    "string.empty": "name can not be empty",
  }),
  serving_size: joi.number().empty().required().messages({
    "number.base": "please enter a valid serving size",
    "any.required": "serving size is required",
    "number.empty": "serving size can not be empty",
  }),
  servings_count: joi.number().empty().required().messages({
    "number.base": "please enter a valid servings count",
    "any.required": "servings count is required",
    "number.empty": "servings count can not be empty",
  }),
  serving_size_unit: joi.string().empty().required().messages({
    "string.base": "please enter a valid serving size unit",
    "any.required": "serving size unit is required",
    "string.empty": "serving size unit can not be empty",
  }),
  servings_count_unit: joi.string().empty().required().messages({
    "string.base": "please enter a valid servings count unit",
    "any.required": "servings count unit is required",
    "string.empty": "servings count unit can not be empty",
  }),
  calories: joi.number().empty().required().messages({
    "number.base": "please enter a valid calories",
    "any.required": "calories is required",
    "number.empty": "calories can not be empty",
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
});
