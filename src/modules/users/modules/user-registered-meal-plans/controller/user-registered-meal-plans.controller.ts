import { UserRegisteredMealPlansService } from "../services/user-registered-meal-plans.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { UserRegisteredMealPlansPopulateSerialization } from "@common/serializers/user-registered-meal-planPopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
interface userRequest extends Request {
  jwtPayload?: any;
}

@Controller("/user/myMealPlan")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersRegisteredMealPlansController extends BaseController {
  private userRegisteredMealPlansService = new UserRegisteredMealPlansService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.get));
  }

  @SwaggerGet()
  @SwaggerResponse(UserRegisteredMealPlansPopulateSerialization)
  @SwaggerSummary("get my meal plan")
  @SwaggerDescription("Get the meal plan that the user is currently using")
  get = async (req: userRequest, res: Response): Promise<Response> => {
    const data = await this.userRegisteredMealPlansService.findOneOrFail(
      { user: req.jwtPayload._id, isActive: true },
      {
        populateArray: [
          { path: "meal_plan" },
          { path: "days.meals"}
        ],
      });

    return JsonResponse.success(
      {
        data: serialize(data, UserRegisteredMealPlansPopulateSerialization),
      },
      res
    );
  };
}
