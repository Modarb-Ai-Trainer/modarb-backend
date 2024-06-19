import { ExerciseService } from "../services/exercises.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { ExercisePopulateSerialization } from "@common/serializers/exercisePopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

@Controller("/user/exercises")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersExerciseController extends BaseController {
  private exercisesService = new ExerciseService();

  setRoutes(): void {
    this.router.get("/search", asyncHandler(this.search));
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
  }

  @SwaggerGet()
  @SwaggerResponse([ExercisePopulateSerialization])
  @SwaggerSummary("List exercises")
  @SwaggerDescription("List all exercises")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
    filterName: "string",
    filterVal: "string"
  })
  list = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);

    let filterName = req.query.filterName, filterVal = req.query.filterVal;
    let filter = { isDeleted: false };

    if (filterName && filterVal) {
      filter[`${filterName}`] = filterVal;
    }

    const { docs, paginationData } = await this.exercisesService.list(
      filter,
      paginationQuery,
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.secondary" },
          { path: "equipments" }
        ]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ExercisePopulateSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(ExercisePopulateSerialization)
  @SwaggerSummary("instructions-workout && target muscle-workout")
  @SwaggerDescription("Get a single exercise")
  get = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.exercisesService.findOneOrFail(
      {
        _id: req.params.id,
        isDeleted: false
      },
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.secondary" },
          { path: "equipments" }
        ]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(data, ExercisePopulateSerialization),
      },
      res
    );
  };

  @SwaggerGet('/search')
  @SwaggerResponse([ExercisePopulateSerialization])
  @SwaggerSummary("Search for exercises")
  @SwaggerDescription("You can use filters in search like category")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
    searchTerm: "string",
    filter: "string"
  })
  search = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    let query = {};
    let searchTerm = req.query.searchTerm;
    let isNum = !isNaN(parseInt(String(searchTerm)));

    let filterVal = req.query.filter;

    if (isNum) {
      query =
      {
        $or: [
          { reps: { $eq: searchTerm } },
          { sets: { $eq: searchTerm } },
          { duration: { $eq: searchTerm } }
        ]
      };
    }

    else {
      if (filterVal) {
        query = {
          category: filterVal,
          name: { $regex: searchTerm, $options: "i" }
        };
      }
      else {
        query = {
          name: { $regex: searchTerm, $options: "i" }
        };
      }
    }
    query = { ...query, isDeleted: false }
    const { docs, paginationData } = await this.exercisesService.search(
      query,
      paginationQuery,
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.secondary" },
          { path: "equipments" }
        ]
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ExercisePopulateSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
