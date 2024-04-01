import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { createWorkoutSchema } from "../validations/create-workout.validation";
import { updateWorkoutSchema } from "../validations/update-workout.validation";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serializtion";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { AdminGuardMiddleware } from "modules/console/common/guards/admins.guard";

@Prefix("/console/workouts")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class WorkoutController extends BaseController {
    private workoutsService = new WorkoutService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
        this.router.post("/",
            bodyValidator(createWorkoutSchema),
            asyncHandler(this.create));
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

    delete = async (req: Request, res: Response) => {
        const data = await this.workoutsService.deleteOne({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), WorkoutSerialization),
            },
            res
        );
    };
};