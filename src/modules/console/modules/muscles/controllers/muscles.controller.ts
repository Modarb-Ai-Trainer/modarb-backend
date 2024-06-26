import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
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
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

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
    @SwaggerSummary("List muscles")
    @SwaggerDescription("List all muscles in the system")
    @SwaggerQuery({
        limit: "number",
        skip: "number",
    })
    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.musclesService.list(
            { isDeleted: false },
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
    @SwaggerSummary("Get muscle")
    @SwaggerDescription("Get muscle by id")
    get = async (req: Request, res: Response) => {
        const data = await this.musclesService.findOneOrFail({
            _id: req.params.id,
            isDeleted: false
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
    @SwaggerSummary("Create muscle")
    @SwaggerDescription("Create a new muscle")
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
    @SwaggerSummary("Update muscle")
    @SwaggerDescription("Update a muscle by id")
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
    @SwaggerSummary("Delete muscle")
    @SwaggerDescription("Delete a muscle by id")
    delete = async (req: Request, res: Response) => {
        const data = await this.musclesService.softDelete({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MuscleSerialization),
            },
            res
        );
    };
};
