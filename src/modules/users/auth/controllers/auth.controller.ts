import { UsersAuthService } from "../services/users.service";
import { loginValidationSchema } from "../validation/login.validation";
import { Request, Response } from "express";
import { JsonResponse } from "src/lib/responses/json-response";
import { userRegisterSchema, IUserRegister } from "src/common/validations/user-register.validation";
import { asyncHandler } from "@helpers/async-handler";
import { bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";

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
    const user = await this.authService.register(req.body as IUserRegister);
    const response = new JsonResponse({
      data: user,
    });
    return res.json(response);
  };

  login = async (req: Request, res: Response) => {
    const { user, token } = await this.authService.login(req.body);
    const response = new JsonResponse({
      data: { user, token },
    });
    return res.json(response);
  };
}
