import { UsersService } from "../services/users.service";
import { JsonResponse } from "@lib/responses/json-response";
import { Request, Response } from "express";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { UserSerialization } from "@common/serializers/user.serialization";
import { SwaggerPost } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";

@Controller("/console/users")
export class AdminUsersController extends BaseController {
  private usersService: UsersService = new UsersService();

  setRoutes() {
    this.router.post("/create", asyncHandler(this.create));
  }

  @SwaggerPost("/create")
  @SwaggerResponse(UserSerialization)
  create = async (req: Request, res: Response): Promise<Response> => {
    let user = await this.usersService.create(req.body);

    return JsonResponse.success(
      {
        status: 201,
        data: serialize(user, UserSerialization),
      },
      res
    );
  };
}
