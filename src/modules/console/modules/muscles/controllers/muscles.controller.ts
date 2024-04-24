import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { AdminGuardMiddleware } from "modules/console/common/guards/admins.guard";
import { MusclesService } from "../services/muscles.service";
import { createMusclechema } from "../validations/create-muscle.validation";
import { updateMuscleSchema } from "../validations/update-muscle.validation";
import { MuscleSerialization } from "@common/serializers/equipment.serialization";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerGet, SwaggerPost, SwaggerPatch, SwaggerDelete } from "@lib/decorators/swagger-routes.decorator";

@Controller("/console/muscles")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class MusclesController extends BaseController {
    private musclesService = new MusclesService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
        this.router.post("/",
            bodyValidator(createMusclechema),
            asyncHandler(this.create));
        this.router.patch(
            "/:id",
            paramsValidator("id"),
            bodyValidator(updateMuscleSchema),
            asyncHandler(this.update)
        );
        this.router.delete(
            "/:id",
            paramsValidator("id"),
            asyncHandler(this.delete)
        );
    }

    @SwaggerGet()
    @SwaggerResponse([MuscleSerialization])
    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.musclesService.list(
            {},
            paginationQuery
        );

        return JsonResponse.success(
            {
                data: serialize(docs, MuscleSerialization),
                meta: paginationData,
            },
            res
        );
    };

    @SwaggerGet('/:id')
    @SwaggerResponse(MuscleSerialization)
    get = async (req: Request, res: Response) => {
        const data = await this.musclesService.findOneOrFail({
            _id: req.params.id,
        });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MuscleSerialization),
            },
            res
        );
    };

    @SwaggerPost()
    @SwaggerRequest(createMusclechema)
    @SwaggerResponse(MuscleSerialization)
    create = async (req: Request, res: Response) => {
        const data = await this.musclesService.create(req.body);
        return JsonResponse.success(
            {
                status: 201,
                data: serialize(data.toJSON(), MuscleSerialization),
            },
            res
        );
    };

    @SwaggerPatch('/:id')
    @SwaggerRequest(updateMuscleSchema)
    @SwaggerResponse(MuscleSerialization)
    update = async (req: Request, res: Response) => {
        const data = await this.musclesService.updateOne(
            { _id: req.params.id },
            req.body
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MuscleSerialization),
            },
            res
        );
    };

    @SwaggerDelete('/:id')
    @SwaggerResponse(MuscleSerialization)
    delete = async (req: Request, res: Response) => {
        const data = await this.musclesService.deleteOne({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MuscleSerialization),
            },
            res
        );
    };
};
