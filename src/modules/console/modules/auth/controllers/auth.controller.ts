import { asyncHandler } from "@helpers/async-handler";
import { serialize } from "@helpers/serialize";
import { bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { JsonResponse } from "@lib/responses/json-response";
import { Request, Response } from "express";
import { loginValidationSchema } from "modules/users/modules/auth/validation/login.validation";
import { ConsoleAuthService } from "../services/auth.service";
import { AdminSerialization } from "modules/console/common/serializers/admin.serialization";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerPost } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";

@Controller("/console/auth")
export class ConsoleAuthController extends BaseController {
  private authService = new ConsoleAuthService();

  public setRoutes(): void {
    this.router.post(
      "/login",
      bodyValidator(loginValidationSchema),
      asyncHandler(this.login)
    );
  }

  @SwaggerPost('/login')
  @SwaggerRequest(loginValidationSchema)
  @SwaggerResponse(AdminSerialization)
  @SwaggerSummary("Login an admin")
  @SwaggerDescription("Login an admin")
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
