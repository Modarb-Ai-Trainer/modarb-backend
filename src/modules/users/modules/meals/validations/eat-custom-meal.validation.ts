import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IEatCustomMeal {
  ingredients: {
    id: string;
    noServings: number;
  }[];
}

export const eatCustomMealKeys = {
  ingredients: joi.array().items(joi.object({
    id: joi.string().required(),
    noServings: joi.number().required(),
  })).required(),
};

export const eatCustomMealSchema = createSchema<IEatCustomMeal>(eatCustomMealKeys);
