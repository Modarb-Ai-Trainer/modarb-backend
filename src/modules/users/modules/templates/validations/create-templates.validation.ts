import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";


export interface ICreateTemplates {
    name: string;
    user: string;
    exercises: string[];
}

export const createTemplatesSchema = createSchema<ICreateTemplates>({
    name: joi.string().empty().required().messages({
        "string.base": "please enter a valid name",
        "any.required": "name is required",
        "string.empty": "name can not be empty",
    }),
    user: joi.string().empty().required().messages({
        "string.base": "please enter a valid user id",
        "any.required": "user id is required",
        "string.empty": "user id can not be empty",
    }),
    exercises: joi.array().empty().required().items(
        joi.string().empty().required().messages({
            "string.base": "please enter a valid exercise id",
            "any.required": "exercise id is required",
            "string.empty": "exercise id can not be empty",
        }),).messages({
            "array.base": "please enter a valid exercises array",
            "any.required": "exercises array is required",
            "array.empty": "exercises array can not be empty",
        }),
});