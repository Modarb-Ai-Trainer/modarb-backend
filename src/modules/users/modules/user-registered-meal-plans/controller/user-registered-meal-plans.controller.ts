import { UserRegisteredMealPlansService } from "../services/user-registered-meal-plans.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { GetMyMealPlanSerialization } from "@common/serializers/user-registered-meal-planPopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerPost } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
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
    this.router.post(
      "/",
      asyncHandler(this.create)
    );
  }

  @SwaggerGet()
  @SwaggerResponse(GetMyMealPlanSerialization)
  @SwaggerSummary("get my meal plan")
  @SwaggerDescription("Get the meal plan that the user is currently using")
  get = async (req: userRequest, res: Response): Promise<Response> => {
    const data = await this.userRegisteredMealPlansService.findOneOrFail(
      { user: req.jwtPayload.id, isActive: true },
      {
        populateArray: [
          { path: "meal_plan", select: "-days" },
          { path: "days.meals", populate: { path: "ingredients" } }
        ],
      });

    return JsonResponse.success(
      {
        data: serialize(data, GetMyMealPlanSerialization),
      },
      res
    );
  };


  @SwaggerPost()
  @SwaggerResponse(GetMyMealPlanSerialization)
  @SwaggerRequest({ meal_plan: "string" })
  @SwaggerSummary("create my meal plan")
  @SwaggerDescription("Create a new meal plan for the user")
  create = async (req: userRequest, res: Response) => {
    const data = await this.userRegisteredMealPlansService.createForUser(req.body, req.jwtPayload.id);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data.toJSON(), GetMyMealPlanSerialization),
      },
      res
    );
  };
}
