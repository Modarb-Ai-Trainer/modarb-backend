import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Place } from "@common/enums/place.enum";


export interface ICreateWorkout {
    name: string;
    description: string;
    type: string;
    created_by: string;
    image?: string;
    fitness_level: string;
    fitness_goal: string;
    place: [string];
    min_per_day: number;
    total_number_days: number;
    template_weeks: [
        {
            week_number: number;
            week_name: string,
            week_description: string,
            days: [
                {
                    day_number: number,
                    total_number_exercises: number,
                    day_type: string,
                    exercises: [string],
                },
            ],
        },
    ]
}

export const createWorkoutSchema = createSchema<ICreateWorkout>({
    name: joi.string().empty().required().messages({
        "string.base": "please enter a valid name",
        "any.required": "name is required",
        "string.empty": "name can not be empty",
    }),
    description: joi.string().empty().required().messages({
        "string.base": "please enter a valid name",
        "any.required": "name is required",
        "string.empty": "name can not be empty",
    }),
    type: joi.string().empty().required().messages({
        "string.base": "please enter a valid type",
        "any.required": "type is required",
        "string.empty": "type can not be empty",
    }),
    created_by: joi.string().empty().required().messages({
        "string.base": "please enter a valid created_by",
        "any.required": "created_by is required",
        "string.empty": "created_by can not be empty",
    }),
    image: joi.string().empty().optional().messages({
        "string.base": "please enter a valid image url",
        "string.empty": "image url can not be empty",
    }),
    fitness_level: joi.string().valid(...Object.values(FitnessLevel)).empty().required().messages({
        "string.base": "please enter a valid fitness level",
        "any.required": "fitness level is required",
        "string.empty": "fitness level can not be empty",
        "any.only": `Fitness level must be one of the following values: ${FitnessLevel.ADVANCED}, ${FitnessLevel.BEGINNER} or ${FitnessLevel.INTERMEDIATE}`
    }),
    fitness_goal: joi.string().valid(...Object.values(FitnessGoal)).empty().required().messages({
        "string.base": "please enter a valid fitness goal",
        "any.required": "fitness goal is required",
        "string.empty": "fitness goal can not be empty",
        "any.only": `Fitness goal must be one of the following values: ${FitnessGoal.GAIN_MUSCLE}, ${FitnessGoal.GET_FITTER} or ${FitnessGoal.LOSE_WEIGHT}`
    }),
    place: joi.array().empty().required().items(
        joi.string().empty().required().valid(...Object.values(Place)).messages({
            "string.base": "please enter a valid place",
            "any.required": "place is required",
            "string.empty": "place can not be empty",
            "any.only": `place must be one of the following values: ${Place.GYM} or ${Place.HOME}`
        })
    ).messages({
        "array.base": "please enter a valid place array",
        "any.required": "place array is required",
        "array.empty": "place array can not be empty",
    }),
    min_per_day: joi.number().integer().empty().required().messages({
        "number.base": "please enter a valid min per day",
        "any.required": "min per day is required",
        "number.empty": "min per day can not be empty",
        "number.integer": "day number must be an integer",
    }),
    total_number_days: joi.number().integer().empty().required().messages({
        "number.base": "please enter a valid total number days",
        "any.required": "total number days is required",
        "number.empty": "total number days can not be empty",
        "number.integer": "day number must be an integer",
    }),
    template_weeks: joi.array().empty().required().items(
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
        "array.base": "please enter a valid templateWeeks",
        "any.required": "templateWeeks is required",
        "array.empty": "templateWeeks can not be empty",
    }),
});