import { FitnessLevel } from "@common/enums/fitness-level.enum";
import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ICreateMealPlan {
  image: string;
  description: string;
  Duration: number;
  Level: FitnessLevel;
  your_Journey: string;
  key_Features: {
    title: string;
    description: string;
  }[];
  days: {
    day_number: number;
    meals: string[];
  }[];
}

export const CreateMealPlanKeys = {
  image: joi.string().empty().required().messages({
    "string.base": "please enter a valid image",
    "any.required": "image is required",
    "string.empty": "image can not be empty",
  }),
  description: joi.string().empty().required().messages({
    "string.base": "please enter a valid description",
    "any.required": "description is required",
    "string.empty": "description can not be empty",
  }),
  Duration: joi.number().empty().required().messages({
    "number.base": "please enter a valid Duration",
    "any.required": "Duration is required",
    "number.empty": "Duration can not be empty",
  }),
  Level: joi.string().empty().required().messages({
    "string.base": "please enter a valid Level",
    "any.required": "Level is required",
    "string.empty": "Level can not be empty",
  }),
  your_Journey: joi.string().empty().required().messages({
    "string.base": "please enter a valid your_Journey",
    "any.required": "your_Journey is required",
    "string.empty": "your_Journey can not be empty",
  }),
  key_Features: joi.array().required().items(
    joi.object({
      title: joi.string().empty().required().messages({
        "string.base": "please enter a valid title",
        "any.required": "title is required",
        "string.empty": "title can not be empty",
      }),
      description: joi.string().empty().required().messages({
        "string.base": "please enter a valid description",
        "any.required": "description is required",
        "string.empty": "description can not be empty",
      }),
    }).required().empty().messages({
      "any.required": "key_Features is required",
      "object.empty": "key_Features can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid key_Features",
    "any.required": "key_Features is required",
    "array.empty": "key_Features can not be empty",
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
    }).required().messages({
      "any.required": "days is required",
      "object.empty": "days can not be empty",
    }),
  ).messages({
    "array.base": "please enter a valid days",
    "any.required": "days is required",
    "array.empty": "days can not be empty",
  }),



};

export const CreateMealPlan = createSchema<ICreateMealPlan>(CreateMealPlanKeys);
