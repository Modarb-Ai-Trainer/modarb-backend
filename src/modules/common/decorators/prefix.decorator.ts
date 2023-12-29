import { BaseController } from "../../../lib/controllers/controller.base";

export const Prefix = (prefix: string) => {
  return (target: typeof BaseController) => {
    target.prefix = prefix || target.prefix;
  };
};
