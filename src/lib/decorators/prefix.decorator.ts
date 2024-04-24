import { swaggerRegistry } from "@lib/swagger/swagger";
import { BaseController } from "../controllers/controller.base";

export const Controller = (prefix: string) => {
  return (target: typeof BaseController) => {
    const originalConstructor = target;
    const newConstructor: any = function (...args: any[]) {
      const instance = new (originalConstructor as any)(...args);
      instance.prefix = prefix || instance.prefix;
      return instance;
    };
    newConstructor.prototype = originalConstructor.prototype;
    swaggerRegistry.setControllerPrefix(
      target.prototype.constructor.name,
      prefix
    );
    swaggerRegistry.setControllerTags(target.prototype.constructor.name, [
      prefix
        .split("/")
        .slice(1)
        .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
        .join(" - "),
    ]);
    return newConstructor;
  };
};
