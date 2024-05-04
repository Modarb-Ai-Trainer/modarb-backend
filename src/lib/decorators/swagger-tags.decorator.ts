import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerTags = (...tags: string[]) => {
  if (!tags.length) return;
  return (target: any) => {
    target.constructor['targetName'] = target.prototype.constructor.name = getCallingFileName();
    target = target.prototype.constructor.name + getCallingFileName();
    swaggerRegistry.setControllerTags(target, tags);
  };
};
