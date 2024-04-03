import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";
import { FitnessGoal } from "@common/enums/fitness-goal.enum";
import { FitnessLevel } from "@common/enums/fitness-level.enum";
import { Place } from "@common/enums/place.enum";



export interface IUpdateWorkout {
    name?: string;
    description?: string;
    type?: string;
    created_by?: string;
    image?: string;
    fitness_level?: string;
    fitness_goal?: string;
    place?: [string];
    min_per_day?: number;
    total_number_days?: number;
    template_weeks?: [
        {
            week_number?: number;
            week_name?: string,
            week_description?: string,
            days?: [
                {
                    day_number?: number,
                    total_number_exercises?: number,
                    day_type?: string,
                    exercises?: [string],
                },
            ],
        },
    ]
}


export const updateWorkoutSchema = createSchema<IUpdateWorkout>({
    name: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    description: joi.string().empty().optional().messages({
        "string.base": "please enter a valid name",
        "string.empty": "name can not be empty",
    }),
    type: joi.string().empty().optional().messages({
        "string.base": "please enter a valid type",
        "string.empty": "type can not be empty",
    }),
    created_by: joi.string().empty().optional().messages({
        "string.base": "please enter a valid created_by",
        "string.empty": "created_by can not be empty",
    }),
    image: joi.string().empty().optional().messages({
        "string.base": "please enter a valid image url",
        "string.empty": "image url can not be empty",
    }),
    fitness_level: joi.string().valid(...Object.values(FitnessLevel)).empty().optional().messages({
        "string.base": "please enter a valid fitness level",
        "string.empty": "fitness level can not be empty",
        "any.only": `Fitness level must be one of the following values: ${FitnessLevel.ADVANCED}, ${FitnessLevel.BEGINNER} or ${FitnessLevel.INTERMEDIATE}`
    }),
    fitness_goal: joi.string().valid(...Object.values(FitnessGoal)).empty().optional().messages({
        "string.base": "please enter a valid fitness goal",
        "string.empty": "fitness goal can not be empty",
        "any.only": `Fitness goal must be one of the following values: ${FitnessGoal.GAIN_MUSCLE}, ${FitnessGoal.GET_FITTER} or ${FitnessGoal.LOSE_WEIGHT}`
    }),
    place: joi.array().empty().optional().items(
        joi.string().empty().optional().valid(...Object.values(Place)).messages({
            "string.base": "please enter a valid place",
            "string.empty": "place can not be empty",
            "any.only": `place must be one of the following values: ${Place.GYM} or ${Place.HOME}`
        })
    ).messages({
        "array.base": "please enter a valid place array",
        "array.empty": "place array can not be empty",
    }),
    min_per_day: joi.number().integer().empty().optional().messages({
        "number.base": "please enter a valid min per day",
        "number.empty": "min per day can not be empty",
        "number.integer": "day number must be an integer",
    }),
    total_number_days: joi.number().integer().empty().optional().messages({
        "number.base": "please enter a valid total number days",
        "number.empty": "total number days can not be empty",
        "number.integer": "day number must be an integer",
    }),
    template_weeks: joi.array().empty().optional().items(
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
                        joi.string().empty().required().messages({
                            "string.base": "please enter a valid exercise id",
                            "string.empty": "exercise id can not be empty",
                        }),).messages({
                            "array.base": "please enter a valid exercises array",
                            "array.empty": "exercises array can not be empty",
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
        "array.base": "please enter a valid templateWeeks",
        "array.empty": "templateWeeks can not be empty",
    }),

});