import { BaseController } from "../../../lib/controllers/controller.base";

export const Prefix = (prefix: string) => {
  return (target: typeof BaseController) => {
    const originalConstructor = target;
    const newConstructor: any = function (...args: any[]) {
      const instance = new (originalConstructor as any)(...args);
      instance.prefix = prefix || instance.prefix;
      return instance;
    };
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
  };
};
