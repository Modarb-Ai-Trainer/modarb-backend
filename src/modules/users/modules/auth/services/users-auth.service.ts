import bcrypt from "bcrypt";
import { ILogin } from "../validation/login.validation";
import { HttpError } from "@lib/error-handling/http-error";
import { JwtHelper } from "@helpers/jwt.helper";
import { User } from "@common/models/user.model";
import { IUserRegister } from "@common/validations/user-register.validation";
import { CrudService } from "@lib/services/crud.service";

export class UsersAuthService extends CrudService(User) {
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
    const token = JwtHelper.generateToken({
      id: user._id,
      email: user.email,
      name: user.name,
      type: "user",
    });
    return { user, token };
  }
}
