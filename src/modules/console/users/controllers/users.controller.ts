import { jwtHelper } from "../../../../helpers/jwt.helper";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../common/decorators/prefix.decorator";
import { userRegisterValidation } from "../../../common/users/validation/user.baseValidation";
import { UsersService } from "../services/users.service";

const allowedRoles = ["superAdmin", "admin"];

@Prefix("/console/users")
export class AdminUsersController extends BaseController {
  private usersService: UsersService = new UsersService();

  setRoutes() {
    this.router.post(
      "/create",
      jwtHelper.verifyToken(allowedRoles),
      bodyValidator(userRegisterValidation),
      this.create
    );
  }

  create = async (req, res) => {
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
}
