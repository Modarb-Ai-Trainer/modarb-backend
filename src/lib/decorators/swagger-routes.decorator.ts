import { swaggerRegistry } from "@lib/swagger/swagger";

export const SwaggerRoute = (
  path: string = "",
  method: "get" | "post" | "put" | "patch" | "delete"
) => {
  return (target: any, propertyKey: string) => {
    swaggerRegistry.updateRoute(target.constructor.name, {
      propertyKey,
      path,
      method,
    });
  };
};

export const SwaggerGet = (path: string = "") => SwaggerRoute(path, "get");
export const SwaggerPost = (path: string = "") => SwaggerRoute(path, "post");
export const SwaggerPut = (path: string = "") => SwaggerRoute(path, "put");
export const SwaggerPatch = (path: string = "") => SwaggerRoute(path, "patch");
export const SwaggerDelete = (path: string = "") =>
  SwaggerRoute(path, "delete");
