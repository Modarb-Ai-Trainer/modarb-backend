import { MealsService } from "../services/meals.service";
import { MealPopulateSerialization } from "@common/serializers/mealPopulate.serialization";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet, SwaggerPost } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";
import { IUserRequest } from "@common/interfaces/user-request.interface";
import { IEatCustomMeal, eatCustomMealSchema } from "../validations/eat-custom-meal.validation";
import { bodyValidator } from "@helpers/validation.helper";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";


@Controller("/user/meals")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersMealsController extends BaseController {
  private mealsService = new MealsService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.post("/eat-custom-meal", bodyValidator(eatCustomMealSchema), asyncHandler(this.eatCustomMeal));
  }

  @SwaggerGet()
  @SwaggerResponse([MealPopulateSerialization])
  @SwaggerSummary("list meals")
  @SwaggerDescription("List all meals")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.mealsService.list(
      { isDeleted: false },
      paginationQuery,
      {
        populateArray: [
          { path: "ingredients" }]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, MealPopulateSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerPost('/eat-custom-meal')
  @SwaggerResponse({})
  @SwaggerRequest(eatCustomMealSchema)
  @SwaggerSummary("Eat custom meal")
  @SwaggerDescription("Eat custom meal")
  eatCustomMeal = async (req: IUserRequest, res: Response) => {
    await this.mealsService.eatCustomMeal(req.jwtPayload.id, req.body as IEatCustomMeal);

    return JsonResponse.success(
      {
        message: "Meal created successfully",
      },
      res
    );
  };
}

