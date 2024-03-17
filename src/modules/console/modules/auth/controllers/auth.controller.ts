import { asyncHandler } from "@helpers/async-handler";
import { serialize } from "@helpers/serialize";
import { bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { JsonResponse } from "@lib/responses/json-response";
import { Request, Response } from "express";
import { loginValidationSchema } from "modules/users/modules/auth/validation/login.validation";
import { ConsoleAuthService } from "../services/auth.service";
import { AdminSerialization } from "modules/console/common/serializers/admin.serialization";

@Prefix("/console/auth")
export class ConsoleAuthController extends BaseController {
  private authService = new ConsoleAuthService();

  public setRoutes(): void {
    this.router.post(
      "/login",
      bodyValidator(loginValidationSchema),
      asyncHandler(this.login)
    );
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    const { admin, token } = await this.authService.login(req.body);

    return JsonResponse.success(
      {
        data: { admin: serialize(admin, AdminSerialization), token },
      },
      res
    );
  };
}
