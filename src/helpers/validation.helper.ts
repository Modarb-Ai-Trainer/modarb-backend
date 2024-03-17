import { JsonResponse } from "@lib/responses/json-response";
import { NextFunction, Request, Response } from "express";
import { createValidator } from "express-joi-validation";
import Joi from "joi";

const validator = createValidator({ passError: true });

export const bodyValidator = validator.body;
export const queryValidator = validator.query;
export const paramsValidator = (schemaOrParam: Joi.Schema | string) =>
  typeof schemaOrParam === "string"
    ? validator.params(Joi.object({ [schemaOrParam]: Joi.string().required() }))
    : validator.params(schemaOrParam);

export const validationErrorHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.error && err.error.isJoi) {
    console.log(`err`, err.error);

    const errors = err.error.details.map((detail) => detail.message);
    return JsonResponse.validationError(
      {
        errors,
      },
      res
    );
  } else {
    // pass on to another error handler
    next(err);
  }
};
