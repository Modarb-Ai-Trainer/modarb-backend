import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface ICreateEquipment{
    name: string;
    image: string;
}

export const createEquipmentchema = createSchema<ICreateEquipment>({
    name: joi.string().empty().required().messages({
        "string.base": "please enter a valid name",
        "any.required": "name is required",
        "string.empty": "name can not be empty",
    }),
    image: joi.string().empty().required().messages({
        "string.base": "please enter a valid image url",
        "string.empty": "image url can not be empty",
    }),
});
