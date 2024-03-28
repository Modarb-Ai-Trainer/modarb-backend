import { Role } from "@common/enums/role.enum";
import { IJwtLoginPayload } from "@common/interfaces/jwt-payload.interface";
import { genGuard } from "@lib/guards/gen-guard";

type AdminGuardMiddlewareProps = {
  roles?: Role[];
};

export const AdminGuardMiddleware = genGuard(
  async (args: AdminGuardMiddlewareProps = {}, payload: IJwtLoginPayload) => {
    if (payload.type !== "admin") {
      return false;
    }

    if (args?.roles && args?.roles.length > 0) {
      if (!args.roles.includes(payload.role)) {
        return false;
      }
    }

    return true;
  }
);
