import { BaseController } from "../controllers/controller.base";

/**
 * Decorator that adds a prefix to a controller's path.
 * @param prefix - The prefix to be added.
 * @returns A decorator function.
 */
export const ControllerMiddleware = (middleware: any) => {
  return (target: typeof BaseController) => {
    const originalConstructor = target;
    const newConstructor: any = function (...args: any[]) {
      const instance: BaseController = new (originalConstructor as any)(
        ...args
      );
      instance.router.use(middleware);
      return instance;
    };
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
  };
};
