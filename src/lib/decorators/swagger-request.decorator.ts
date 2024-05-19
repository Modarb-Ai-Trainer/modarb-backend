import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

const parseToSchema = (schema: any, joiSchema: any) => {
  joiSchema = joiSchema.describe && joiSchema.describe().keys || joiSchema.keys || joiSchema;
  const properties = Object.getOwnPropertyNames(joiSchema);
  properties.forEach((property) => {
    const type = joiSchema[property].type;
    if (type === "array") {
      const at = joiSchema[property].items[0].type;
      // recursively parse array
      if (at === "object" || at === "array") {
        schema.properties[property] = {
          type: "array",
          items: {
            type: "object",
            properties: {},
          },
        };
        parseToSchema(schema.properties[property].items, joiSchema[property].items[0]);
      } else {
        schema.properties[property] = {
          type: "array",
          items: {
            type: at,
          },
        };
      }

    } else if (type === "object") {
      schema.properties[property] = {
        type: "object",
        properties: {},
      };
      parseToSchema(schema.properties[property], joiSchema[property]);
    } else {
      schema.properties[property] = { type };
    }
  });
}

export const SwaggerRequest = (joiSchema: any) => {
  return (target: any, propertyKey: string) => {
    const schema: any = {
      type: "object",
      properties: {},
    };

    parseToSchema(schema, joiSchema)

    target.constructor['targetName'] = target.constructor.name + getCallingFileName();
    swaggerRegistry.updateRoute(target.constructor['targetName'], {
      propertyKey,
      request: schema,
    });
  };
};
