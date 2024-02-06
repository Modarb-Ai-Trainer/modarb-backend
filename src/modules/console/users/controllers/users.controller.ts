import { userRegisterSchema } from "src/modules/common/users/validation/user-register.validation";
import { asyncHandler } from "../../../../helpers/async-handler";
import { JwtHelper } from "../../../../helpers/jwt.helper";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../../lib/decorators/prefix.decorator";
import { UsersService } from "../services/users.service";
import { JsonResponse } from "src/lib/responses/json-response";

const allowedRoles = ["superAdmin", "admin"];

@Prefix("/console/users")
export class AdminUsersController extends BaseController {
  private usersService: UsersService = new UsersService();

  setRoutes() {
    this.router.post(
      "/create",
      JwtHelper.verifyToken(allowedRoles),
      bodyValidator(userRegisterSchema),
      asyncHandler(this.create)
    );
  }

  create = async (req, res) => {
    let user = await this.usersService.create(req.body);
    return new JsonResponse({
      data: user,
    });
  };
}
