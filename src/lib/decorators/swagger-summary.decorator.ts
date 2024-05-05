import { swaggerRegistry } from "@lib/swagger/swagger";
import { getCallingFileName } from "@lib/utils/calling-file.helper";

export const SwaggerSummary = (summary: string) => {
  return (target: any, propertyKey: string) => {
    target.constructor['targetName'] = target.constructor.name + getCallingFileName()
    swaggerRegistry.updateRoute(target.constructor.name + getCallingFileName(), {
      propertyKey,
      summary,
    });
  };
};
