import * as joi from "joi";
import { createSchema } from "@helpers/create-schema";

export interface IHomeStreakQuery {
  startDate: string;
  endDate: string;
}

export const homeStreakQueryKeys = {
  startDate: joi.string().pattern(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")).required().messages({
    "string.base": "startDate must be a string",
    "string.pattern.base": "startDate must be a valid date",
    "any.required": "startDate is required",
  }),
  endDate: joi.string().pattern(new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$")).required().messages({
    "string.base": "endDate must be a string",
    "string.pattern.base": "endDate must be a valid date",
    "any.required": "endDate is required",
  })
};

export const homeStreakQueryValidation = createSchema<IHomeStreakQuery>(homeStreakQueryKeys);
