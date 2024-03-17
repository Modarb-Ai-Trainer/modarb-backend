import { IJwtLoginPayload } from "@common/interfaces/jwt-payload.interface";
import { genGuard } from "@lib/guards/gen-guard";

export const UsersGuardMiddleware = genGuard(
  async (args, payload: IJwtLoginPayload) => payload.type === "user"
);
