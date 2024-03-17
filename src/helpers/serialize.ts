import { plainToClass } from "class-transformer";
import { Document } from "mongoose";

/**
 * Serializes the given object or array of objects into the specified class type.
 *
 * @template T - The class type to serialize the object(s) into.
 * @param serializable - The object or array of objects to be serialized.
 * @param serializer - The class constructor function for the target serialization type.
 * @returns The serialized object(s) of type T or an array of serialized objects of type T.
 */
export const serialize = <T>(
  serializable:
    | Record<string, any>
    | Record<string, any>[]
    | Document
    | Document[],
  serializer: new () => T
): T | T[] => {
  // If the serializable object is a Document, convert it to a JSON object.
  if (serializable.hasOwnProperty("toJSON"))
    serializable = (serializable as Document).toJSON();

  // If the serializable object is an array, serialize each item in the array.
  if (Array.isArray(serializable)) {
    return serializable.map((item) => serialize(item, serializer)) as T[];
  }

  // Serialize the object and return it.
  return plainToClass(serializer, serializable, {
    excludeExtraneousValues: true,
  }) as T;
};
