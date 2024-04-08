import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateMuscle {
    name?: string;
    image?: string;
}


export const updateMuscleSchema = createSchema<IUpdateMuscle>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    image: joi.string().empty().optional().messages({
        "string.base": "please enter a valid image url",
        "string.empty": "image url can not be empty",
    }),
});
