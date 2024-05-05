import { loginValidationSchema } from "../validation/login.validation";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import {
  userRegisterSchema,
  IUserRegister,
} from "@common/validations/user-register.validation";
import { asyncHandler } from "@helpers/async-handler";
import { bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { UserSerialization } from "@common/serializers/user.serialization";
import { UsersAuthService } from "../services/users-auth.service";
import { SwaggerPost } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";

@Controller("/user/auth")
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

  @SwaggerPost("/register")
  @SwaggerRequest(userRegisterSchema)
  @SwaggerResponse(UserSerialization)
  @SwaggerSummary("Register a new user")
  register = async (req: Request, res: Response) => {
    const user = await this.authService.register(req.body as IUserRegister);

    return JsonResponse.success(
      {
        data: serialize(user, UserSerialization),
      },
      res
    );
  };

  @SwaggerPost("/login")
  @SwaggerRequest(loginValidationSchema)
  @SwaggerResponse(UserSerialization)
  @SwaggerSummary("Login a user")
  login = async (req: Request, res: Response): Promise<Response> => {
    const { user, token } = await this.authService.login(req.body);

    return JsonResponse.success(
      {
        data: { user: serialize(user, UserSerialization), token },
      },
      res
    );
  };
}
