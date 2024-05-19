import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";


export interface ICreateUserRegisteredWorkouts {
    workout: string;
}

export const createUserRegisteredWorkoutsSchema = createSchema<ICreateUserRegisteredWorkouts>({
  workout: joi.string().empty().required().messages({
      "string.base": "please enter a valid workout id",
      "any.required": "workout id is required",
      "string.empty": "workout id can not be empty",
  }),
});
