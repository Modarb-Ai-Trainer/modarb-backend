import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";


export interface IDays {
    day?: string;
    exercises?: string[];
    isDone?: Boolean;
};


export interface IWeeks {
    days?: IDays[];
};

export interface IUpdateUserRegisteredWorkouts {
    user?: string;
    workout?: string;
    isActive?: Boolean;
    weeks?: IWeeks[];
};


export const updateUserRegisteredWorkoutsSchema = createSchema<IUpdateUserRegisteredWorkouts>({
    user: joi.string().empty().optional().messages({
        "string.base": "please enter a valid user id",
        "string.empty": "user id can not be empty",
    }),
    isActive: joi.boolean().empty().optional().messages({
        "boolean.base": "please enter a valid isActive",
        "boolean.empty": "isActive can not be empty",
    }),
    workout: joi.string().empty().optional().messages({
        "string.base": "please enter a valid workout id",
        "string.empty": "workout id can not be empty",
    }),
    weeks: joi.array().empty().optional().items(
        joi.object({
            days: joi.array().optional().items(
                joi.object({
                    day: joi.number().empty().optional().messages({
                        "number.base": "please enter a valid day number",
                        "number.empty": "day number can not be empty",
                    }),
                    exercises: joi.array().empty().optional().items(
                        joi.string().empty().optional().messages({
                            "string.base": "please enter a valid exercise id",
                            "string.empty": "exercise id can not be empty",
                        }),).messages({
                            "array.base": "please enter a valid exercises array",
                            "array.empty": "exercises array can not be empty",
                        }),
                    isDone: joi.boolean().empty().optional().messages({
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