import { plainToClass } from "class-transformer";

export const serialize = <T>(
  serializable: Record<string, any> | Record<string, any>[],
  serializer: new () => T
): T | T[] => {
  if (Array.isArray(serializable)) {
    return serializable.map((item) => serialize(item, serializer)) as T[];
  }

  return plainToClass(serializer, serializable, {
    excludeExtraneousValues: true,
  }) as T;
};