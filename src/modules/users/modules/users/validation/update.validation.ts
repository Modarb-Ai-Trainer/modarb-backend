import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IUpdateUser {
    name?: string;
    email?: string;
    gender?: string;
    height?: number;
    weight?: number;
    fitness_level?: string;
    preferences?: {
        fitness_goal: string;
        target_weight: number;
        workout_frequency: number;
        preferred_days: string[];
        workout_place: string;
        preferred_equipment: string[];
    };
    injuries?: string[];
    dob?: Date;
}

export const updateUserSchema = createSchema<IUpdateUser>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),

    email: joi.string().optional().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "eg", "io"] },
    }).empty().messages({
        "string.email": "please enter a valid email",
        "string.empty": "email can not be empty",
    }),

    gender: joi.string().empty().optional().messages({
        "string.base": "please enter a valid gender",
        "string.empty": "gender can not be empty",
    }),

    height: joi.number().optional().messages({
        "number.base": "please enter a valid height",
        "number.empty": "height can not be empty"
    }),

    weight: joi.number().optional().messages({
        "number.base": "please enter a valid weight",
        "number.empty": "weight can not be empty"
    }),

    fitness_level: joi.string().empty().optional().messages({
        "string.base": "please enter a valid fitness_level",
        "string.empty": "fitness_level can not be empty"
    }),

    preferences: joi.object().keys({
        fitness_goal: joi.string().empty().optional().messages({
            "string.base": "please enter a valid fitness goal",
            "string.empty": "fitness goal can not be empty"
        }),
        target_weight: joi.number().optional().messages({
            "number.base": "please enter a valid target weight",
            "number.empty": "target weight can not be empty"
        }),
        workout_frequency: joi.number().optional().messages({
            "number.base": "please enter a valid workout frequency",
            "number.empty": "workout frequency can not be empty"
        }),
        preferred_days: joi.array().items(joi.string()).optional().messages({
            "array.base": "please enter a valid preferred day",
            "array.empty": "preferred day can not be empty"
        }),
        workout_place: joi.string().empty().optional().messages({
            "string.base": "please enter a valid workout place",
            "string.empty": "workout place can not be empty"
        }),
        preferred_equipment: joi.array().items(joi.string()).optional().messages({
            "array.base": "please enter a valid preferred equipment",
            "array.empty": "preferred equipment can not be empty"
        }),
    }),
    injuries: joi.array().items(joi.string()).optional().messages({
        "array.base": "please enter a valid injury",
        "array.empty": "injuries can not be empty"
    }),
    dob: joi.date().optional().messages({
        "date.base": "please enter a valid date of birth",
        "date.empty": "date of birth can not be empty"
    }),
});
