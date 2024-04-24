import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { createWorkoutSchema } from "../validations/create-workout.validation";
import { updateWorkoutSchema } from "../validations/update-workout.validation";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { AdminGuardMiddleware } from "modules/console/common/guards/admins.guard";
import {
  SwaggerDelete,
  SwaggerGet,
  SwaggerPatch,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";

@Controller("/console/workouts")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class WorkoutController extends BaseController {
  private workoutsService = new WorkoutService();

  setRoutes() {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",
      bodyValidator(createWorkoutSchema),
      asyncHandler(this.create)
    );
    this.router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(updateWorkoutSchema),
      asyncHandler(this.update)
    );
    this.router.delete(
      "/:id",
      paramsValidator("id"),
      asyncHandler(this.delete)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([WorkoutSerialization])
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.workoutsService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, WorkoutSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(WorkoutSerialization)
  get = async (req: Request, res: Response) => {
    const data = await this.workoutsService.findOneOrFail({
      _id: req.params.id,
    });
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), WorkoutSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(WorkoutSerialization)
  @SwaggerRequest(createWorkoutSchema)
  create = async (req: Request, res: Response) => {
    const data = await this.workoutsService.create(req.body);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data.toJSON(), WorkoutSerialization),
      },
      res
    );
  };

  @SwaggerPatch("/:id")
  @SwaggerResponse(WorkoutSerialization)
  @SwaggerRequest(updateWorkoutSchema)
  update = async (req: Request, res: Response) => {
    const data = await this.workoutsService.updateOne(
      { _id: req.params.id },
      req.body
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), WorkoutSerialization),
      },
      res
    );
  };

  @SwaggerDelete("/:id")
  @SwaggerResponse(WorkoutSerialization)
  delete = async (req: Request, res: Response) => {
    const data = await this.workoutsService.deleteOne({ _id: req.params.id });
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), WorkoutSerialization),
      },
      res
    );
  };
}
