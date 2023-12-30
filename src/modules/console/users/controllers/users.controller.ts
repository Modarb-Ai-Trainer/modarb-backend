import { jwtHelper } from "../../../../helpers/jwt.helper";
import { validator } from "../../../../helpers/validation.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../common/decorators/prefix.decorator";
import { usersService } from "../services/users.service";
import { adminUserValidation } from "../validation/admin.userValidation";

const allowedRoles = ["superAdmin", "admin"];

@Prefix("/admin/users")
export class adminUsersController extends BaseController {
  static setRoutes(router) {
    router.post(
      "/create",
      jwtHelper.verifyToken(allowedRoles),
      validator(adminUserValidation.createValidation),
      adminUsersController.create
    );
  }

  static async create(req, res) {
    try {
      let result = await usersService.create(req.body);
      return res.status(result.code).json(result);
    } catch (err) {
      console.log(`err.message`, err.message);
      return res.status(500).json({
        success: false,
        code: 500,
        error: err.message,
      });
    }
  }
}
