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
import { MealPlansService } from "../services/meal-plans.service";
import { CreateMealPlan } from "../validations/create-meal-plan.validation";
import { UpdateMealPlan } from "../validations/update-meal-plan.validation";
import { MealPlanSerialization } from "@common/serializers/meal-plan.serialization";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerGet, SwaggerPost, SwaggerPatch, SwaggerDelete } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

@Controller("/console/mealPlans")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class AdminsMealPlansController extends BaseController {
    private mealPlansService = new MealPlansService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
        this.router.post("/",
            bodyValidator(CreateMealPlan),
            asyncHandler(this.create));
        this.router.patch(
            "/:id",
            paramsValidator("id"),
            bodyValidator(UpdateMealPlan),
            asyncHandler(this.update)
        );
        this.router.delete(
            "/:id",
            paramsValidator("id"),
            asyncHandler(this.delete)
        );
    }

    @SwaggerGet()
    @SwaggerResponse([MealPlanSerialization])
    @SwaggerSummary("List meal plans")
    @SwaggerDescription("List all meal plans in the system")
    @SwaggerQuery({
        limit: "number",
        skip: "number",
    })
    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.mealPlansService.list(
            { isDeleted: false },
            paginationQuery,
        );

        return JsonResponse.success(
            {
                data: serialize(docs, MealPlanSerialization),
                meta: paginationData,
            },
            res
        );
    };

    @SwaggerGet('/:id')
    @SwaggerResponse(MealPlanSerialization)
    @SwaggerSummary('Get meal plan')
    @SwaggerDescription('Get meal plan by id')
    get = async (req: Request, res: Response) => {
        const data = await this.mealPlansService.findOneOrFail(
            {
                _id: req.params.id,
                isDeleted: false
            },
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealPlanSerialization),
            },
            res
        );
    };

    @SwaggerPost()
    @SwaggerRequest(CreateMealPlan)
    @SwaggerResponse(MealPlanSerialization)
    @SwaggerSummary('Create meal plan')
    @SwaggerDescription('Create a new meal plan')
    create = async (req: Request, res: Response) => {
        const data = await this.mealPlansService.create(req.body);
        return JsonResponse.success(
            {
                status: 201,
                data: serialize(data.toJSON(), MealPlanSerialization),
            },
            res
        );
    };

    @SwaggerPatch('/:id')
    @SwaggerRequest(UpdateMealPlan)
    @SwaggerResponse(MealPlanSerialization)
    @SwaggerSummary('Update meal plan')
    @SwaggerDescription('Update a meal plan by id')
    update = async (req: Request, res: Response) => {
        const data = await this.mealPlansService.updateOne(
            { _id: req.params.id },
            req.body
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealPlanSerialization),
            },
            res
        );
    };

    @SwaggerDelete('/:id')
    @SwaggerResponse(MealPlanSerialization)
    @SwaggerSummary('Delete meal plan')
    @SwaggerDescription('Delete a meal plan by id')
    delete = async (req: Request, res: Response) => {
        const data = await this.mealPlansService.softDelete({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), MealPlanSerialization),
            },
            res
        );
    };
};
