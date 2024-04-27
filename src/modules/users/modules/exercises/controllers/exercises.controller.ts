import { ExerciseService } from "../services/exercises.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { ExerciseSerialization } from "@common/serializers/exercise.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";

@Controller("/user/exercises")
@ControllerMiddleware(UsersGuardMiddleware())
export class ExerciseController extends BaseController {
  private exercisesService = new ExerciseService();

  setRoutes(): void {
    this.router.get("/search", asyncHandler(this.search));
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
  }

  @SwaggerGet()
  @SwaggerResponse([ExerciseSerialization])
  list = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.exercisesService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ExerciseSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(ExerciseSerialization)
  get = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.exercisesService.findOneOrFail({
      _id: req.params.id,
    });

    return JsonResponse.success(
      {
        data: serialize(data, ExerciseSerialization),
      },
      res
    );
  };

  @SwaggerGet()
  @SwaggerResponse([ExerciseSerialization])
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
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, ExerciseSerialization),
        meta: paginationData,
      },
      res
    );
  };
}
