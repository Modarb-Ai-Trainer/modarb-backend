import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { MealType } from "@common/enums/meal-type.enum";


export interface IUpdateIngredients {
  name?: string;
  serving_size?: number;
  servings_count?: number;
  serving_size_unit?: string;
  servings_count_unit?: string;
  calories?: number;
  carbs?: number;
  proteins?: number;
  fats?: number;
}

export const updateIngredientsSchema = createSchema<IUpdateIngredients>({
  name: joi.string().empty().optional().messages({
    "string.base": "please enter a valid name",
    "string.empty": "name can not be empty",
  }),
  serving_size: joi.number().empty().optional().messages({
    "number.base": "please enter a valid serving size",
    "number.empty": "serving size can not be empty",
  }),
  servings_count: joi.number().empty().optional().messages({
    "number.base": "please enter a valid servings count",
    "number.empty": "servings count can not be empty",
  }),
  serving_size_unit: joi.string().empty().optional().messages({
    "string.base": "please enter a valid serving size unit",
    "string.empty": "serving size unit can not be empty",
  }),
  servings_count_unit: joi.string().empty().optional().messages({
    "string.base": "please enter a valid servings count unit",
    "string.empty": "servings count unit can not be empty",
  }),
  calories: joi.number().empty().optional().messages({
    "number.base": "please enter a valid calories",
    "number.empty": "calories can not be empty",
  }),
  carbs: joi.number().empty().optional().messages({
    "number.base": "please enter a valid carbs",
    "number.empty": "carbs can not be empty",
  }),
  proteins: joi.number().empty().optional().messages({
    "number.base": "please enter a valid proteins",
    "number.empty": "proteins can not be empty",
  }),
  fats: joi.number().empty().optional().messages({
    "number.base": "please enter a valid fats",
    "number.empty": "fats can not be empty",
  }),
});
