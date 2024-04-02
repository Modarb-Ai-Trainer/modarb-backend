import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateWorkout {
    name?: string;
    type?: string;
    created_by?: string;
    templateWeeks?: object[];
};


export const updateWorkoutSchema = createSchema<IUpdateWorkout>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    type: joi.string().empty().optional().messages({
        "string.base": "please enter a valid type",
        "string.empty": "type can not be empty",
    }),
    created_by: joi.string().empty().optional().messages({
        "string.base": "please enter a valid created_by",
        "string.empty": "created_by can not be empty",
    }),
    templateWeeks: joi.array().empty().optional().messages({
        "array.base": "please enter a valid templateWeeks",
        "array.empty": "templateWeeks can not be empty",
    }),

});