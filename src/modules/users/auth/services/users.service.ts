import { UsersBaseService } from "../../../common/users/services/users.base.service";
import bcrypt from "bcrypt";

export class UsersAuthService extends UsersBaseService {
  async comparePassword(email: string, password: string) {
    try {
      if (email != undefined) {
        email = email.toLowerCase();
      }
      let result = await this.find({ email });
      if (!result.success) return result;

      let match = await bcrypt.compare(password, result.record.password);
      delete result.record.password;

      if (!match)
        return {
          success: false,
          code: 409,
          message: "password isn't correct",
        };

      return {
        success: true,
        code: 200,
        record: result.record,
      };
    } catch (err) {
      console.log(`err.message`, err.message);
      return {
        success: false,
        code: 500,
        error: err.message,
      };
    }
  }
}
