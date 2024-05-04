import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerRequest = (joiSchema: any) => {
  return (target: any, propertyKey: string) => {
    const schema: any = {
      type: "object",
      properties: {},
    };

    const properties = Object.getOwnPropertyNames(joiSchema.describe().keys);
    properties.forEach((property) => {
      schema.properties[property] = {
        type: joiSchema.describe().keys[property].type,
      };
    });

    target.constructor['targetName'] = target.constructor.name + getCallingFileName();
    swaggerRegistry.updateRoute(target.constructor['targetName'], {
      propertyKey,
      request: schema,
    });
  };
};
