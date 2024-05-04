import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerResponseProperty = (
  props?:
    | {
        name?: string;
        type?: any;
      }
    | string
) => {
  if (typeof props === "string") {
    return (target: any, propertyKey: string) => {
      target.constructor['targetName'] = target.constructor.name + getCallingFileName();
      swaggerRegistry.updateSchemaProperty({
        schema: target.constructor['targetName'],
        property: propertyKey,
        type: props,
      });
    };
  }

  return (target: any, propertyKey: string) => {
    target.constructor['targetName'] = target.constructor.name + getCallingFileName();
    swaggerRegistry.updateSchemaProperty({
      schema: target.constructor['targetName'],
      property: propertyKey,
      newName: props?.name,
      type: props?.type,
    });
  };
};
