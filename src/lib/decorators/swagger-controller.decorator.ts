import { swaggerRegistry } from "@lib/swagger/swagger";

export const SwaggerController = (path: string) => {
  return (target: any) => {
    target = target.prototype.constructor.name;
    swaggerRegistry.setControllerPrefix(target, path);
  };
};
