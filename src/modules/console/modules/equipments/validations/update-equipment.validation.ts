import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateEquipment {
    name?: string;
    image?: string;
}


export const updateEquipmentSchema = createSchema<IUpdateEquipment>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    image: joi.string().empty().optional().messages({
        "string.base": "please enter a valid image url",
        "string.empty": "image url can not be empty",
    }),
});
