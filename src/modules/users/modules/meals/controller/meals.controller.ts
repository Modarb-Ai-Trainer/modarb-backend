import { MealsService } from "../services/meals.service";
import { MealSerialization } from "@common/serializers/meal.serialization";
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


@Controller("/user/meals")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersMealsController extends BaseController {
  private mealsService = new MealsService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
  }

  @SwaggerGet()
  @SwaggerResponse([MealSerialization])
  @SwaggerSummary("list meals")
  @SwaggerDescription("list meals")
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.mealsService.list(
      {},
      paginationQuery,
      {
        populateArray: [
          { path: "ingredients" }]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, MealSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
