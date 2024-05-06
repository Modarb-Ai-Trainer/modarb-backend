import { MealPlansService } from "../services/meal-plans.service";
import { MealPlanSerialization } from "@common/serializers/meal-plan.serialization";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";


@Controller("/user/mealPlans")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersMealPlansController extends BaseController {
  private mealPlansService = new MealPlansService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
  }

  @SwaggerGet()
  @SwaggerResponse([MealPlanSerialization])
  @SwaggerSummary("list meal plans")
  @SwaggerDescription("list meal plans")
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.mealPlansService.list(
      {},
      paginationQuery,
      {
        populateArray: [
          { path: "days.meals", select: "name ingredients calories carbs proteins fats type" }
        ],
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, MealPlanSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
