import { userRegisterSchema } from "src/common/validations/user-register.validation";
import { asyncHandler } from "../../../../helpers/async-handler";
import { JwtHelper } from "../../../../helpers/jwt.helper";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../../lib/decorators/prefix.decorator";
import { UsersService } from "../services/users.service";
import { JsonResponse } from "src/lib/responses/json-response";
import { Request, Response } from "express";

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

  create = async (req: Request, res: Response) => {
    let user = await this.usersService.create(req.body);
    const response = new JsonResponse({
      data: user,
    });
    return res.json(response);
  };
}
