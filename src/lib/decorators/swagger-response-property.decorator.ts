import { swaggerRegistry } from "@lib/swagger/swagger";

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
      swaggerRegistry.updateSchemaProperty({
        schema: target.constructor.name,
        property: propertyKey,
        type: props,
      });
    };
  }

  return (target: any, propertyKey: string) => {
    swaggerRegistry.updateSchemaProperty({
      schema: target.constructor.name,
      property: propertyKey,
      newName: props?.name,
      type: props?.type,
    });
  };
};
