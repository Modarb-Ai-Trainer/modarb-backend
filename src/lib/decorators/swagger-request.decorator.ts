import { swaggerRegistry } from "@lib/swagger/swagger";

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

    swaggerRegistry.updateRoute(target.constructor.name, {
      propertyKey,
      request: schema,
    });
  };
};
