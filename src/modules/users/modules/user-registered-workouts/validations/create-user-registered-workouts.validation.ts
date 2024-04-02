import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IDays {
    day: string;
    exercises: string[];
    isDone?: Boolean;
};


export interface IWeeks {
    days: IDays[];
};


export interface ICreateUserRegisteredWorkouts {
    user: string;
    workout: string;
    isActive: Boolean;
    weeks: IWeeks[];
};


export const createUserRegisteredWorkoutsSchema = createSchema<ICreateUserRegisteredWorkouts>({
    user: joi.string().empty().required().messages({
        "string.base": "please enter a valid user id",
        "any.required": "user id is required",
        "string.empty": "user id can not be empty",
    }),
    isActive: joi.boolean().empty().optional().messages({
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
            days: joi.array().required().items(
                joi.object({
                    day: joi.number().empty().required().messages({
                        "number.base": "please enter a valid day number",
                        "any.required": "day number is required",
                        "number.empty": "day number can not be empty",
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
                    isDone: joi.boolean().empty().optional().messages({
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