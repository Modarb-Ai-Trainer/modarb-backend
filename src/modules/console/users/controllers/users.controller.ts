import { userRegisterSchema } from "src/modules/common/users/validation/user-register.validation";
import { asyncHandler } from "../../../../helpers/async-handler";
import { jwtHelper } from "../../../../helpers/jwt.helper";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../../lib/decorators/prefix.decorator";
import { UsersService } from "../services/users.service";

const allowedRoles = ["superAdmin", "admin"];

@Prefix("/console/users")
export class AdminUsersController extends BaseController {
  private usersService: UsersService = new UsersService();

  setRoutes() {
    this.router.post(
      "/create",
      jwtHelper.verifyToken(allowedRoles),
      bodyValidator(userRegisterSchema),
      asyncHandler(this.create)
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
