import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";


export interface ICreateUserRegisteredWorkouts {
    user: string;
    workout: string;
    is_active?: Boolean;
    weeks: [
        {
            week_number: number;
            week_name: string,
            week_description: string,
            is_done?: boolean,
            days: [
                {
                    day_number: number,
                    total_number_exercises: number,
                    day_type: string,
                    exercises: [string],
                    is_done?: boolean,
                },
            ],
        },
    ]
}

export const createUserRegisteredWorkoutsSchema = createSchema<ICreateUserRegisteredWorkouts>({
    user: joi.string().empty().required().messages({
        "string.base": "please enter a valid user id",
        "any.required": "user id is required",
        "string.empty": "user id can not be empty",
    }),
    is_active: joi.boolean().empty().optional().messages({
        "boolean.base": "please enter a valid isActive",
        "boolean.empty": "isActive can not be empty",
    }),
    workout: joi.string().empty().required().messages({
        "string.base": "please enter a valid workout id",
        "any.required": "workout id is required",
        "string.empty": "workout id can not be empty",
    }),
    weeks: joi.array().empty().required().items(
        joi.object({
            week_number: joi.number().integer().empty().required().messages({
                "number.base": "please enter a valid week number",
                "any.required": "week number is required",
                "number.empty": "week number can not be empty",
                "number.integer": "week number must be an integer",
            }),
            week_name: joi.string().empty().required().messages({
                "string.base": "please enter a valid week name",
                "any.required": "week name is required",
                "string.empty": "week name can not be empty",
            }),
            week_description: joi.string().empty().required().messages({
                "string.base": "please enter a valid week description",
                "any.required": "week description is required",
                "string.empty": "week description can not be empty",
            }),
            is_done: joi.boolean().empty().optional().messages({
                "boolean.base": "please enter a valid isDone",
                "boolean.empty": "isDone can not be empty",
            }),
            days: joi.array().required().items(
                joi.object({
                    day_number: joi.number().empty().integer().min(1).max(7).required().messages({
                        "number.base": "Please enter a valid day number",
                        "any.required": "day number is required",
                        "number.empty": "day number cannot be empty",
                        "number.integer": "day number must be an integer",
                        "number.min": "day number must be between 1 and 7",
                        "number.max": "day number must be between 1 and 7"
                    }),
                    total_number_exercises: joi.number().empty().integer().required().messages({
                        "number.base": "Please enter a valid total number exercises",
                        "any.required": "total number exercises is required",
                        "number.empty": "total number exercises cannot be empty",
                        "number.integer": "total number exercises must be an integer",
                    }),
                    day_type: joi.string().empty().required().messages({
                        "string.base": "please enter a valid day type",
                        "any.required": "day type is required",
                        "string.empty": "day type can not be empty",
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
                    is_done: joi.boolean().empty().optional().messages({
                        "boolean.base": "please enter a valid isDone",
                        "boolean.empty": "isDone can not be empty",
                    }),
                }).empty().messages({
                    "object.base": "please enter a valid day object",
                    "any.required": "day object is required",
                    "object.empty": "day object can not be empty",
                })
            ),
        }).empty().messages({
            "array.base": "please enter a valid days array",
            "any.required": "days array is required",
            "array.empty": "days array can not be empty",

        })
    ).messages({
        "array.base": "please enter a valid weeks array",
        "any.required": "weeks array is required",
        "array.empty": "weeks array can not be empty",
    }),
});