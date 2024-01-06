// export const validator = (schema: any) => {
//     return (req: any, res: any, next: any) => {
//         try {
//             let validationResult = schema.body.validate(req.body);
//             var validation = [];
//             if (validationResult.error) {
//                 validation.push(validationResult.error.details[0].message);
//             }
//             if (validation.length) {
//                 return res.status(400).json({ success: false, error: validation.join(), code: 400 });
//             }
//             next();
//         } catch (err) {
//             console.log(`err`, err);
//             return res.status(400).json({ success: false, error: "Bad Request!", code: 400 });
//         }
//     };
// };

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.error && err.error.isJoi) {
    console.log(`err`, err.error);

    const errors = err.error.details.map((detail) => detail.message);
    return res.status(422).json({
      success: false,
      errors: errors,
      code: 422,
    });
  } else {
    // pass on to another error handler
    next(err);
  }
};
