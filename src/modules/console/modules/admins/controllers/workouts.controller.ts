import { WorkoutService } from "../services/workouts.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { WorkoutSerialization } from "@common/serializers/workout.serializtion";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";

@Prefix("/admins/workouts")
@ControllerMiddleware(UsersGuardMiddleware())

export class WorkoutController extends BaseController {
    private workoutsService = new WorkoutService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    }

    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.workoutsService.list(
            {},
            paginationQuery
        );

        // const response = new JsonResponse({
        // data: serialize(docs, WorkoutSerialization),
        // meta: paginationData,
        // });
        // return res.json(response);
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
        const data = await this.workoutsService.update(
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
        const data = await this.workoutsService.delete({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), WorkoutSerialization),
            },
            res
        );
    };
};