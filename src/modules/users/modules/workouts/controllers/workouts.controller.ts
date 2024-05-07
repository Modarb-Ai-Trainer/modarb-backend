import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerializationPopulate } from "@common/serializers/workoutPopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import { SwaggerGet } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";


@Controller("/user/workouts")
@ControllerMiddleware(UsersGuardMiddleware())
export class UsersWorkoutController extends BaseController {
  private workoutsService = new WorkoutService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
  }

  @SwaggerGet()
  @SwaggerResponse([WorkoutSerializationPopulate])
  @SwaggerSummary("List workouts")
  @SwaggerDescription("List all workouts in the system")
  list = async (req: Request, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.workoutsService.list(
      {},
      paginationQuery
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
  @SwaggerSummary("Get  workout")
  @SwaggerDescription("Get a single workout")
  get = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.workoutsService.findOneOrFail(
      { _id: req.params.id },
      {
        populateArray: [
          { path: "template_weeks.days.exercises", select: "name media reps sets" },
        ],
      });

    return JsonResponse.success(
      {
        data: serialize(data, WorkoutSerializationPopulate),
      },
      res
    );
  };
}
