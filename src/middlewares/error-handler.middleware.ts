import { JsonResponse } from "@lib/responses/json-response";
import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";

export const errorHandlerMiddleware = (
  err: MongooseError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorMessage = err.message;
  let status = err.status || 500;
  console.log("errorHandlerMiddleware -> err", err);

  if (err.code === 11000) {
    // Handle validation errors
    const errors = [];
    try {
      const errorInKeys = Object.keys(err.keyValue);
      errorInKeys.forEach((key) => {
        errors.push(`${key} already exists`);
      });
    } catch (error) {
      errors.push("Duplicate key error");
    }
    return JsonResponse.validationError(
      {
        errors,
      },
      res
    );
  } else if (err.code === 66) {
    // Handle cast errors
    status = 400;
    if (err.path) {
      errorMessage = `Invalid ${err.path}`;
    } else {
      errorMessage = "Invalid data";
    }
  } else if (err.code === 2) {
    // Handle other mongoose errors
    status = 400;
    if (err.message) {
      errorMessage = err.message;
    } else {
      errorMessage = "Invalid data";
    }
  }

  JsonResponse.error(
    {
      error: errorMessage,
      status,
    },
    res
  );

  console.error(err.message, err.stack);
};
