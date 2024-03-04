import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serializtion";

@Prefix("/users/workouts")
export class WorkoutController extends BaseController {
  private workoutsService = new WorkoutService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
  }

  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.workoutsService.list(
      {},
      paginationQuery
    );

    const response = new JsonResponse({
      data: serialize(docs, WorkoutSerialization),
      meta: paginationData,
    });
    return res.json(response);
  };

  get = async (req: Request, res: Response) => {
    const data = await this.workoutsService.findOneOrFail({
      _id: req.params.id,
    });
    const response = new JsonResponse({
      data: serialize(data.toJSON(), WorkoutSerialization),
    });
    res.json(response);
  };
}
