import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ICreateExercise {
  name: string;
  category: string;
  duration?: number | null;
  expectedDurationRange: {
    min: number;
    max: number;
  };
  reps: number;
  sets: number;
  instructions: string;
  benefits: string;
  targetMuscles: string[]; // refs
  equipments: string[]; // refs
  media: {
    type: "image" | "video";
    url: string;
  };
}

export const createExerciseSchema = createSchema<ICreateExercise>({
  name: joi.string().empty().required().messages({
    "string.base": "please enter a valid name",
    "any.required": "name is required",
    "string.empty": "name can not be empty",
  }),
  category: joi.string().empty().required().messages({
    "string.base": "please enter a valid category",
    "any.required": "category is required",
    "string.empty": "category can not be empty",
  }),
  duration: joi.number().empty().optional().messages({
    "number.base": "please enter a valid duration",
  }),
  expectedDurationRange: joi.object().keys({
    min: joi.number().required().messages({
      "number.base": "please enter a valid min duration",
      "any.required": "min duration is required",
    }),
    max: joi.number().required().messages({
      "number.base": "please enter a valid max duration",
      "any.required": "max duration is required",
    }),
  }),
  reps: joi.number().empty().required().messages({
    "number.base": "please enter a valid reps",
    "any.required": "reps is required",
  }),
  sets: joi.number().empty().required().messages({
    "number.base": "please enter a valid sets",
    "any.required": "sets is required",
  }),
  instructions: joi.string().empty().required().messages({
    "string.base": "please enter a valid instructions",
    "any.required": "instructions is required",
    "string.empty": "instructions can not be empty",
  }),
  benefits: joi.string().empty().required().messages({
    "string.base": "please enter a valid benefits",
    "any.required": "benefits is required",
    "string.empty": "benefits can not be empty",
  }),
  targetMuscles: joi.object().empty().required().messages({
    "array.base": "please enter a valid target muscles",
    "any.required": "target muscles is required",
  }),
  equipments: joi.array().items(joi.string()).empty().required().messages({
    "array.base": "please enter a valid equipments",
    "any.required": "equipments is required",
  }),
  media: joi.object().keys({
    type: joi.string().valid("image", "video").required().messages({
      "string.base": "please enter a valid media type",
      "any.required": "media type is required",
    }),
    url: joi.string().empty().required().messages({
      "string.base": "please enter a valid media url",
      "any.required": "media url is required",
      "string.empty": "media url can not be empty",
    }),
  }),
});
