import { IngredientsService } from "../services/ingredients.service";
import { IngredientSerialization } from "@common/serializers/ingredient.serialization";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
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


@Controller("/user/ingredients")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersIngredientsController extends BaseController {
  private ingredientsService = new IngredientsService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/search", asyncHandler(this.search));
  }

  @SwaggerGet()
  @SwaggerResponse([IngredientSerialization])
  @SwaggerSummary("list ingredients")
  @SwaggerDescription("List all ingredients")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
    filterName: "string",
    filterVal: "string"
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);

    let filterName = req.query.filterName, filterVal = req.query.filterVal;
    let filter = {};

    if (filterName && filterVal) {
      filter[`${filterName}`] = filterVal;
    }

    const { docs, paginationData } = await this.ingredientsService.list(
      filter,
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, IngredientSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet('/search')
  @SwaggerResponse([IngredientSerialization])
  @SwaggerSummary("Search for Ingredients")
  @SwaggerDescription("You can search for ingredients by entering characters or numbers.")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
    searchTerm: "string",
  })
  search = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    let query = {};
    let searchTerm = req.query.searchTerm;
    let isNum = !isNaN(parseInt(String(searchTerm)));


    if (isNum) {
      query =
      {
        $or: [
          { fats: { $eq: searchTerm } },
          { proteins: { $eq: searchTerm } },
          { proteins: { $eq: searchTerm } },
          { carbs: { $eq: searchTerm } },
          { calories: { $eq: searchTerm } },
          { serving_size: { $eq: searchTerm } },
          { servings_count: { $eq: searchTerm } }
        ]
      };
    }

    else {
      query = {
        name: { $regex: searchTerm, $options: "i" }
      }
    }

    const { docs, paginationData } = await this.ingredientsService.search(
      query,
      paginationQuery,
    );

    return JsonResponse.success(
      {
        data: serialize(docs, IngredientSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
