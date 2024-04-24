import { swaggerRegistry } from "@lib/swagger/swagger";

export const SwaggerTags = (...tags: string[]) => {
  if (!tags.length) return;
  return (target: any) => {
    target = target.prototype.constructor.name;
    swaggerRegistry.setControllerTags(target, tags);
  };
};
