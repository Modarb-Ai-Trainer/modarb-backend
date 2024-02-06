import * as joi from "joi";

export const createSchema = <T>(
  schema: joi.SchemaMap<T>
): joi.ObjectSchema<T> => {
  return joi.object().required().keys(schema);
};
