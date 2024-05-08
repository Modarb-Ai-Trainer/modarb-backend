import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

const parseToSchema = (schema: any, joiSchema: any) => {
  joiSchema = joiSchema.describe && joiSchema.describe().keys || joiSchema.keys || joiSchema;
  let properties: any;
  try {
    properties = Object.getOwnPropertyNames(joiSchema);
  } catch (error) {
    console.log(joiSchema)
  }
  properties.forEach((property) => {
    const type = joiSchema[property].type;
    if (type === "object") {
      schema.properties[property] = {
        type: "object",
        properties: {},
      };
      parseToSchema(schema.properties[property], joiSchema[property]);
    } else {
      schema.properties[property] = {type};
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
