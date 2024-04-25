import { swaggerRegistry } from "@lib/swagger/swagger";
import { instanceToPlain } from "class-transformer";

const responseToSwaggerSchema = (response: any) => {
  const isClass = typeof response === "function";
  const responseName =
    (isClass && response.prototype.constructor.name) || undefined;
  const responseData = swaggerRegistry.schemasRegistry.get(responseName);

  // turn class to swagger schema
  const schema: any = {
    type: "object",
    properties: (isClass && responseData?.properties) || {},
  };

  // get class properties
  let properties = [];
  let instance;
  try {
    instance = new response();
    properties = Object.getOwnPropertyNames(instanceToPlain(instance));
  } catch (e) {
    instance = response;
    properties = Object.getOwnPropertyNames(instance);
  }

  if (responseData?.propertiesToExclude) {
    properties = properties.filter(
      (property) => !responseData.propertiesToExclude.includes(property)
    );
  }

  properties.forEach((property) => {
    if (!schema.properties[property] && !responseData?.properties) {
      schema.properties[property] = {
        type: (instance[property] && typeof instance[property]) || "string",
      };
    }

    if (schema.properties[property] && !schema.properties[property].type) {
      schema.properties[property].type =
        (instance[property] && typeof instance[property]) || "string";
    }

    if (Array.isArray(schema.properties[property]?.type)) {
      const isTypeObjectOrClass =
        typeof schema.properties[property].type[0] === "function" ||
        typeof schema.properties[property].type[0] === "object";

      if (isTypeObjectOrClass) {
        schema.properties[property].items = responseToSwaggerSchema(
          schema.properties[property].type[0]
        );
        schema.properties[property].type = "array";
      } else {
        schema.properties[property].items = {
          type: schema.properties[property].type[0],
        };
        schema.properties[property].type = "array";
      }
    }

    if (
      typeof schema.properties[property]?.type === "function" ||
      typeof schema.properties[property]?.type === "object"
    ) {
      schema.properties[property] = responseToSwaggerSchema(
        schema.properties[property].type
      );
    }
  });

  return schema;
};

export const SwaggerResponse = (responseClass: any) => {
  return (target: any, propertyKey: string) => {
    const isArray = Array.isArray(responseClass);
    responseClass = isArray ? responseClass[0] : responseClass;
    // turn class to swagger schema
    const schema = responseToSwaggerSchema(responseClass);

    // add standard response schema
    const standardResponseSchema: any = {
      type: "object",
      properties: {
        data: schema,
        message: {
          type: "string",
        },
        status: {
          type: "number",
        },
      },
    };

    // set schema type to array if response is array
    if (isArray) {
      schema.type = "array";
      schema.items = {
        type: "object",
        properties: schema.properties,
      };
    }
    // add meta for array response
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
