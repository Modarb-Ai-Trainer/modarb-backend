import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { MealType } from "@common/enums/meal-type.enum";

export interface IUpdateMeal {
  name?: string;
  created_at?: Date;
  ingredients?: [string];
  calories?: number;
  carbs?: number;
  proteins?: number;
  fats?: number;
  type?: MealType;
}

export const updateMealSchema = createSchema<IUpdateMeal>({
  name: joi.string().empty().optional().messages({
    "string.base": "please enter a valid name",
    "string.empty": "name can not be empty",
  }),
  created_at: joi.date().empty().optional().messages({
    "date.base": "please enter a valid created_at",
    "date.empty": "created_at can not be empty",
  }),
  ingredients: joi.array().items(joi.string()).optional().messages({
    "array.base": "please enter a valid ingredients",
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
  type: joi.string().empty().optional().messages({
    "string.base": "please enter a valid type",
    "string.empty": "type can not be empty",
  }),

});
