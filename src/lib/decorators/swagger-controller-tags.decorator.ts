import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerControllerTags = (...tags: string[]) => {
  if (!tags.length) return;
  return (target: any) => {
    target.constructor['targetName'] = target.prototype.constructor.name = getCallingFileName();
    swaggerRegistry.setControllerTags(target.constructor['targetName'], tags);
  };
};
