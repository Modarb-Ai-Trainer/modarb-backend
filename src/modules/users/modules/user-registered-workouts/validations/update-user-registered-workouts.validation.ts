import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";



export interface IUpdateUserRegisteredWorkouts {
    user?: string;
    workout?: string;
    is_active?: Boolean;
    weeks?: [
        {
            week_number?: number;
            week_name?: string,
            week_description?: string,
            is_done?: boolean,
            days?: [
                {
                    day_number?: number,
                    total_number_exercises?: number,
                    day_type?: string,
                    exercises?: [string],
                    is_done?: boolean,
                },
            ],
        },
    ]
}


export const updateUserRegisteredWorkoutsSchema = createSchema<IUpdateUserRegisteredWorkouts>({
    user: joi.string().empty().optional().messages({
        "string.base": "please enter a valid user id",
        "string.empty": "user id can not be empty",
    }),
    is_active: joi.boolean().empty().optional().messages({
        "boolean.base": "please enter a valid isActive",
        "boolean.empty": "isActive can not be empty",
    }),
    workout: joi.string().empty().optional().messages({
        "string.base": "please enter a valid workout id",
        "string.empty": "workout id can not be empty",
    }),
    weeks: joi.array().empty().optional().items(
        joi.object({
            week_number: joi.number().integer().empty().optional().messages({
                "number.base": "please enter a valid week number",
                "number.empty": "week number can not be empty",
                "number.integer": "week number must be an integer",
            }),
            week_name: joi.string().empty().optional().messages({
                "string.base": "please enter a valid week name",
                "string.empty": "week name can not be empty",
            }),
            week_description: joi.string().empty().optional().messages({
                "string.base": "please enter a valid week description",
                "string.empty": "week description can not be empty",
            }),
            is_done: joi.boolean().empty().optional().messages({
                "boolean.base": "please enter a valid isDone",
                "boolean.empty": "isDone can not be empty",
            }),
            days: joi.array().optional().items(
                joi.object({
                    day_number: joi.number().empty().integer().min(1).max(7).optional().messages({
                        "number.base": "Please enter a valid day number",
                        "number.empty": "day number cannot be empty",
                        "number.integer": "day number must be an integer",
                        "number.min": "day number must be between 1 and 7",
                        "number.max": "day number must be between 1 and 7"
                    }),
                    total_number_exercises: joi.number().empty().integer().optional().messages({
                        "number.base": "Please enter a valid total number exercises",
                        "number.empty": "total number exercises cannot be empty",
                        "number.integer": "total number exercises must be an integer",
                    }),
                    day_type: joi.string().empty().optional().messages({
                        "string.base": "please enter a valid day type",
                        "string.empty": "day type can not be empty",
                    }),
                    exercises: joi.array().empty().optional().items(
                        joi.string().empty().optional().messages({
                            "string.base": "please enter a valid exercise id",
                            "string.empty": "exercise id can not be empty",
                        }),).messages({
                            "array.base": "please enter a valid exercises array",
                            "array.empty": "exercises array can not be empty",
                        }),
                    is_done: joi.boolean().empty().optional().messages({
                        "boolean.base": "please enter a valid isDone",
                        "boolean.empty": "isDone can not be empty",
                    }),
                }).empty().messages({
                    "object.base": "please enter a valid day object",
                    "object.empty": "day object can not be empty",
                })
            ),
        }).empty().messages({
            "array.base": "please enter a valid days array",
            "array.empty": "days array can not be empty",

        })
    ).messages({
        "array.base": "please enter a valid weeks array",
        "array.empty": "weeks array can not be empty",
    }),
});