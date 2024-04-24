import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";



export interface IUpdateTemplates {
    name?: string;
    user?: string;
    exercises?: string[];
}


export const updateTemplatesSchema = createSchema<IUpdateTemplates>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    user: joi.string().empty().optional().messages({
        "string.base": "please enter a valid user id",
        "string.empty": "user id can not be empty",
    }),
    exercises: joi.array().empty().optional().items(
        joi.string().empty().optional().messages({
            "string.base": "please enter a valid exercise id",
            "string.empty": "exercise id can not be empty",
        }),).messages({
            "array.base": "please enter a valid exercises array",
            "array.empty": "exercises array can not be empty",
        }),
});