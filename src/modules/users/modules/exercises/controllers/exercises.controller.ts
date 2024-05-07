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
  list = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.exercisesService.list(
      {},
      paginationQuery,
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.primary" },
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
  @SwaggerSummary("Get exercise")
  @SwaggerDescription("Get a single exercise")
  get = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.exercisesService.findOneOrFail(
      {
        _id: req.params.id,
      },
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.primary" },
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

  @SwaggerGet()
  @SwaggerResponse([ExercisePopulateSerialization])
  @SwaggerSummary("Search")
  @SwaggerDescription("Search for exercises")
  search = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    let query = {};
    let searchTerm = req.query.searchTerm;

    let isNum = !isNaN(parseInt(String(searchTerm)));

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
      if (req.query.filter === "category") {
        query = { category: { $regex: searchTerm, $options: "i" } };
      }
      else {
        query = {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { category: { $regex: searchTerm, $options: "i" } },
            { benefits: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { instructions: { $regex: searchTerm, $options: "i" } },
            { url: { $regex: searchTerm, $options: "i" } }
          ],
        };
      }
    }

    const { docs, paginationData } = await this.exercisesService.search(
      query,
      paginationQuery,
      {
        populateArray: [
          { path: "targetMuscles.primary" },
          { path: "targetMuscles.primary" },
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
