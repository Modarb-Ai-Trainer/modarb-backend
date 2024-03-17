import { CrudService } from "@lib/services/crud.service";
import { Admin } from "modules/console/common/models/admin.model";
import { ILogin } from "modules/users/modules/auth/validation/login.validation";
import bcrypt from "bcrypt";
import { HttpError } from "@lib/error-handling/http-error";
import { JwtHelper } from "@helpers/jwt.helper";

export class ConsoleAuthService extends CrudService(Admin) {
  async login(loginRequest: ILogin) {
    const admin = await this.findOneOrFail({ email: loginRequest.email });
    const isPasswordCorrect = await bcrypt.compare(
      loginRequest.password,
      admin.password
    );
    if (!isPasswordCorrect) throw new HttpError(401, "Incorrect Password");
    const token = JwtHelper.generateToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      type: "admin",
      role: admin.role,
    });
    return { admin: admin, token };
  }
}
