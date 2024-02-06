import { UsersAuthService } from "../services/users.service";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { bodyValidator } from "../../../../helpers/validation.helper";
import { asyncHandler } from "../../../../helpers/async-handler";
import { Prefix } from "../../../../lib/decorators/prefix.decorator";
import { loginValidationSchema } from "../validation/login.validation";
import { userRegisterSchema } from "src/modules/common/users/validation/user-register.validation";
import { Request, Response } from "express";
import { IUser } from "src/modules/common/users/models/user.model";
import { JsonResponse } from "src/lib/responses/json-response";

@Prefix("/users/auth")
export class UsersAuthController extends BaseController {
  private authService = new UsersAuthService();

  setRoutes(): void {
    this.router.post(
      "/register",
      bodyValidator(userRegisterSchema),
      asyncHandler(this.register)
    );
    this.router.post(
      "/login",
      bodyValidator(loginValidationSchema),
      asyncHandler(this.login)
    );
  }

  register = async (req: Request, res: Response) => {
    let user = await this.authService.create(req.body as IUser);
    return new JsonResponse({
      data: user,
    });
  };

  login = async (req, res) => {
    const { user, token } = await this.authService.login(req.body);
    return new JsonResponse({
      data: { user, token },
    });
  };
}
