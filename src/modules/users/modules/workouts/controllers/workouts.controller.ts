import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";

@Prefix("/users/workouts")
@ControllerMiddleware(UsersGuardMiddleware())
export class WorkoutController extends BaseController {
  private workoutsService = new WorkoutService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
  }

  list = async (req: Request, res: Response): Promise<Response> => {
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

  get = async (req: Request, res: Response): Promise<Response> => {
    const data = await this.workoutsService.findOneOrFail({
      _id: req.params.id,
    });

    return JsonResponse.success(
      {
        data: serialize(data, WorkoutSerialization),
      },
      res
    );
  };
}
