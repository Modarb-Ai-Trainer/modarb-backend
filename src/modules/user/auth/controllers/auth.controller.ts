import { UsersService } from "../services/users.service";
import { jwtHelper } from "../../../../helpers/jwt.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../common/decorators/prefix.decorator";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { userRegisterValidation } from "../../../common/users/validation/user.baseValidation";
import { loginValidation } from "../validation/user.Validation";

@Prefix("/user/auth")
export class AuthController extends BaseController {
  private usersService = new UsersService();

  setRoutes(): void {
    this.router.post(
      "/register",
      bodyValidator(userRegisterValidation),
      this.register
    );
    this.router.post("/login", bodyValidator(loginValidation), this.login);
  }

  register = async (req, res) => {
    try {
      let result = await this.usersService.create(req.body);
      return res.status(result.code).json(result);
    } catch (err) {
      console.log(`err.message`, err.message);
      return res.status(500).json({
        success: false,
        code: 500,
        error: err.message,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      let result: {
        success: boolean;
        code: number;
        record?: any;
        message?: string;
      } = await this.usersService.comparePassword(email, password);
      if (!result.success) return res.status(result.code).json(result);
      let payload = {
        _id: result.record?._id,
        name: result.record?.name,
        email: result.record?.email,
        number: result.record?.number,
        role: result.record?.role,
      };
      const token = jwtHelper.generateToken(payload);
      return res.status(result.code).json({
        success: result.success,
        token,
        code: result.code,
        record: result.record,
      });
    } catch (err) {
      console.log(`err.message`, err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
}
