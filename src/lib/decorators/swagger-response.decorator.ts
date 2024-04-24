import { swaggerRegistry } from "@lib/swagger/swagger";
import { instanceToPlain } from "class-transformer";

export const SwaggerResponse = (responseClass: any) => {
  return (target: any, propertyKey: string) => {
    const isArray = Array.isArray(responseClass);
    responseClass = isArray ? responseClass[0] : responseClass;

    // turn class to swagger schema
    const schema: any = {
      type: "object",
      properties: {},
    };

    // get class properties
    let properties = [];
    let instance;
    try {
      instance = new responseClass();
      properties = Object.getOwnPropertyNames(instanceToPlain(instance));
    } catch (e) {
      instance = responseClass;
      properties = Object.getOwnPropertyNames(instance);
    }
    properties.forEach((property) => {
      schema.properties[property] = {
        type: (instance[property] && typeof instance[property]) || "string",
      };
    });

    if (isArray) {
      schema.type = "array";
      schema.items = {
        type: "object",
        properties: schema.properties,
      };
    }

    const standardResponseSchema: any = {
      type: "object",
      properties: {
        data: schema,
        message: {
          type: "string",
        },
        status: {
          type: "string",
        },
      },
    };

    if (isArray) {
      standardResponseSchema.properties.meta = {
        type: "object",
        properties: {
          total: {
            type: "number",
          },
          page: {
            type: "number",
          },
          limit: {
            type: "number",
          },
        },
      };
    }

    swaggerRegistry.updateRoute(target.constructor.name, {
      propertyKey,
      response: standardResponseSchema,
    });
  };
};
