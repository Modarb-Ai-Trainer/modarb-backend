import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ICreateWorkout {
  name: string;
  type: string;
  created_by: string;
  templateWeeks: object[];
};


export const createWorkoutSchema = createSchema<ICreateWorkout>({
    name: joi.string().empty().required().messages({
        "string.base": "please enter a valid name",
        "any.required": "name is required",
        "string.empty": "name can not be empty",
    }),
    type: joi.string().empty().required().messages({
        "string.base": "please enter a valid type",
        "any.required": "type is required",
        "string.empty": "type can not be empty",
    }),
    created_by: joi.string().empty().required().messages({
        "string.base": "please enter a valid created_by",
        "any.required": "created_by is required",
        "string.empty": "created_by can not be empty",
    }),
    templateWeeks: joi.array().empty().required().messages({
        "array.base": "please enter a valid templateWeeks",
        "any.required": "templateWeeks is required",
        "array.empty": "templateWeeks can not be empty",
    }),
});