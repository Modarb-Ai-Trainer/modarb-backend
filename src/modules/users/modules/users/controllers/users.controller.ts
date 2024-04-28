import { UserService } from "../services/users.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { updateUserSchema } from "../validation/update.validation";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { UserSerialization } from "@common/serializers/user.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet, SwaggerPut } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";

@Controller("/users")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersController extends BaseController {
    private userService = new UserService();

    setRoutes(): void {
        this.router.put("/update/:id", paramsValidator("id"), bodyValidator(updateUserSchema), asyncHandler(this.update));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    }


    @SwaggerGet("/:id")
    @SwaggerResponse(UserSerialization)
    get = async (req: Request, res: Response): Promise<Response> => {
        const data = await this.userService.findOneOrFail({
            _id: req.params.id,
        });

        return JsonResponse.success(
            {
                data: serialize(data, UserSerialization),
            },
            res
        );
    };

    @SwaggerPut("/:id")
    @SwaggerResponse(UserSerialization)
    update = async (req: Request, res: Response): Promise<Response> => {
        const data = await this.userService.updateOne(
            {
                _id: req.params.id,
            },
            req.body
        );

        return JsonResponse.success(
            {
                data: serialize(data, UserSerialization),
            },
            res
        );
    };
}