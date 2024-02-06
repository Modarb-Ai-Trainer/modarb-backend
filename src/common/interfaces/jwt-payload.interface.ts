import { Role } from "@common/enums/role.enum";

export type IJwtLoginPayload = {
  id: string;
  email: string;
  name: string;
} & (
  | {
      role: Role;
      type: "admin";
    }
  | {
      type: "user";
    }
);
