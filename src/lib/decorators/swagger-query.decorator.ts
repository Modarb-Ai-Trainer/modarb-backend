import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

type QueryType = "string" | "number" | "boolean";

export const SwaggerQuery = (
  querySchema: Record<
    string,
    | {
        type: QueryType | (string | number | boolean)[];
        required?: boolean;
      }
    | QueryType
    | (string | number | boolean)[]
  >
) => {
  return (target: any, propertyKey: string) => {
    const queryParams = Object.entries(querySchema).map(([key, type]) => {
      let schema;

      if (Array.isArray(type)) {
        schema = {
          type: "string",
          enum: type,
        };
      } else if (typeof type === "string") {
        schema = {
          type,
        };
      } else {
        schema = Array.isArray(type["type"])
          ? {
              type: "string",
              enum: type["type"],
            }
          : {
              type: type.type,
            };
      }

      return {
        name: key,
        in: "query",
        required: type["required"] || false,
        schema,
      };
    });

    target.constructor["targetName"] =
      target.constructor.name + getCallingFileName();
    swaggerRegistry.updateRoute(target.constructor["targetName"], {
      propertyKey,
      queryParams,
    });
  };
};
