import { BaseUsersService } from "../../../common/users/services/users.base.service";
import bcrypt from "bcrypt";
import { ILogin } from "../validation/login.validation";
import { HttpError } from "src/lib/error-handling/http-error";
import { JwtHelper } from "src/helpers/jwt.helper";

export class UsersAuthService extends BaseUsersService {
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
