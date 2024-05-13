import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { createWorkoutSchema } from "../validations/create-workout.validation";
import { updateWorkoutSchema } from "../validations/update-workout.validation";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serialization";
import { WorkoutSerializationPopulate } from "@common/serializers/workoutPopulate.serialization";
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
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

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
  @SwaggerResponse([WorkoutSerializationPopulate])
  @SwaggerSummary("List workouts")
  @SwaggerDescription("List all workouts in the system")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.workoutsService.list(
      {},
      paginationQuery,
      {
        populateArray: [{ path: "template_weeks.days.exercises" }],
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, WorkoutSerializationPopulate),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(WorkoutSerializationPopulate)
  @SwaggerSummary("Get workout")
  @SwaggerDescription("Get workout by id")
  get = async (req: Request, res: Response) => {
    const data = await this.workoutsService.findOneOrFail(
      {
        _id: req.params.id,
      },
      {
        populateArray: [{ path: "template_weeks.days.exercises" }],
      }
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), WorkoutSerializationPopulate),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(WorkoutSerialization)
  @SwaggerRequest(createWorkoutSchema)
  @SwaggerSummary("Create workout")
  @SwaggerDescription("Create a new workout")
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
  @SwaggerSummary("Update workout")
  @SwaggerDescription("Update a workout by id")
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
  @SwaggerSummary("Delete workout")
  @SwaggerDescription("Delete a workout by id")
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
