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
  workout: joi.string().empty().required().messages({
      "string.base": "please enter a valid workout id",
      "any.required": "workout id is required",
      "string.empty": "workout id can not be empty",
  }),
});
