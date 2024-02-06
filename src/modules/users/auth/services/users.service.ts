import bcrypt from "bcrypt";
import { ILogin } from "../validation/login.validation";
import { HttpError } from "src/lib/error-handling/http-error";
import { JwtHelper } from "src/helpers/jwt.helper";
import { userModel } from "src/common/models/user.model";
import { IUserRegister } from "src/common/validations/user-register.validation";
import { CrudService } from "@lib/services/crud.service";

export class UsersAuthService extends CrudService(userModel) {
  async register(createParams: IUserRegister) {
    return this.create(createParams);
  }

  async login(loginRequest: ILogin) {
    const user = await this.findOneOrFail({ email: loginRequest.email });
    const isPasswordCorrect = await bcrypt.compare(
      loginRequest.password,
      user.password
    );
    if (!isPasswordCorrect) throw new HttpError(401, "Incorrect Password");
    const token = JwtHelper.generateToken({ id: user._id, role: user.role });
    return { user, token };
  }
}
