import { MealPlansService } from "../services/meal-plans.service";
import { ListMealPlanSerialization } from "@common/serializers/meal-planPopulate.serialization";
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
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";


@Controller("/user/mealPlans")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersMealPlansController extends BaseController {
  private mealPlansService = new MealPlansService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/ss", asyncHandler(this.ss));
  }

  @SwaggerGet()
  @SwaggerResponse([ListMealPlanSerialization])
  @SwaggerSummary("list meal plans")
  @SwaggerDescription("List all meal plans")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.mealPlansService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ListMealPlanSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/ss")
  ss = async (req: Request, res: Response) => {
    let pMealPlan = await this.mealPlansService.createModelMealPlan({
      id: "664a4b170da4e428849859a0",
      name: "User 0",
      email: "user-0@app.com",
      image: "https://placehold.co/300x400",
      role: "user" as any,
      gender: "male" as any,
      dob: new Date("1990-01-31T22:00:00.000+00:00"),
      height: 170,
      weight: 70,
      fitness_level: "beginner" as any,
    });
  
    return JsonResponse.success(
      {
        data: { pMealPlan: pMealPlan},
      },
      res
    );
  };
}
