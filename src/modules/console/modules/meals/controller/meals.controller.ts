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
import { MealsService } from "../services/meals.service";
import { createMealSchema } from "../validations/create-meals.validation";
import { updateMealSchema } from "../validations/update-meals.validation";
import { MealSerialization } from "@common/serializers/meal.serialization";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerGet, SwaggerPost, SwaggerPatch, SwaggerDelete } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

@Controller("/console/meals")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class AdminsMealsController extends BaseController {
    private mealsService = new MealsService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
        this.router.post("/",
            bodyValidator(createMealSchema),
            asyncHandler(this.create));
        this.router.patch(
            "/:id",
            paramsValidator("id"),
            bodyValidator(updateMealSchema),
            asyncHandler(this.update)
        );
        this.router.delete(
            "/:id",
            paramsValidator("id"),
            asyncHandler(this.delete)
        );
    }

    @SwaggerGet()
    @SwaggerResponse([MealSerialization])
    @SwaggerSummary("List meals")
    @SwaggerDescription("List all meals in the system")
    @SwaggerQuery({
        limit: "number",
        skip: "number",
    })
    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.mealsService.list(
            { isDeleted: false },
            paginationQuery,
        );

        return JsonResponse.success(
            {
                data: serialize(docs, MealSerialization),
                meta: paginationData,
            },
            res
        );
    };

    @SwaggerGet('/:id')
    @SwaggerResponse(MealSerialization)
    @SwaggerSummary('Get meal')
    @SwaggerDescription('Get meal by id')
    get = async (req: Request, res: Response) => {
        const data = await this.mealsService.findOneOrFail(
            {
                _id: req.params.id,
                isDeleted: false
            },
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealSerialization),
            },
            res
        );
    };

    @SwaggerPost()
    @SwaggerRequest(createMealSchema)
    @SwaggerResponse(MealSerialization)
    @SwaggerSummary('Create meal')
    @SwaggerDescription('Create a new meal')
    create = async (req: Request, res: Response) => {
        const data = await this.mealsService.create(req.body);
        return JsonResponse.success(
            {
                status: 201,
                data: serialize(data.toJSON(), MealSerialization),
            },
            res
        );
    };

    @SwaggerPatch('/:id')
    @SwaggerRequest(updateMealSchema)
    @SwaggerResponse(MealSerialization)
    @SwaggerSummary('Update meal')
    @SwaggerDescription('Update a meal by id')
    update = async (req: Request, res: Response) => {
        const data = await this.mealsService.updateOne(
            { _id: req.params.id },
            req.body
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealSerialization),
            },
            res
        );
    };

    @SwaggerDelete('/:id')
    @SwaggerResponse(MealSerialization)
    @SwaggerSummary('Delete meal')
    @SwaggerDescription('Delete a meal by id')
    delete = async (req: Request, res: Response) => {
        const data = await this.mealsService.softDelete({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealSerialization),
            },
            res
        );
    };
};
