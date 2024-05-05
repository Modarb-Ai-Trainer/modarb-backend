import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerEndpointTags = (...tags: string[]) => {
  if (!tags.length) return;
  return (target: any, propertyKey: string) => {
    target.constructor['targetName'] = target.constructor.name + getCallingFileName()
    swaggerRegistry.updateRoute(target.constructor.name + getCallingFileName(), {
      propertyKey,
      tags,
    });
  };
};
