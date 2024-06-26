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
import { IngredientsService } from "../services/ingredients.service";
import { createIngredientsSchema } from "../validations/create-ingredient.validation";
import { updateIngredientsSchema } from "../validations/update-ingredient.validation";
import { IngredientSerialization } from "@common/serializers/ingredient.serialization";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerGet, SwaggerPost, SwaggerPatch, SwaggerDelete } from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

@Controller("/console/ingredients")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class AdminsIngredientsController extends BaseController {
    private ingredientsService = new IngredientsService();

    setRoutes() {
        this.router.get("/", asyncHandler(this.list));
        this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
        this.router.post("/",
            bodyValidator(createIngredientsSchema),
            asyncHandler(this.create));
        this.router.patch(
            "/:id",
            paramsValidator("id"),
            bodyValidator(updateIngredientsSchema),
            asyncHandler(this.update)
        );
        this.router.delete(
            "/:id",
            paramsValidator("id"),
            asyncHandler(this.delete)
        );
    }

    @SwaggerGet()
    @SwaggerResponse([IngredientSerialization])
    @SwaggerSummary("List ingredients")
    @SwaggerDescription("List all ingredients in the system")
    @SwaggerQuery({
        limit: "number",
        skip: "number",
    })
    list = async (req: Request, res: Response) => {
        const paginationQuery = parsePaginationQuery(req.query);
        const { docs, paginationData } = await this.ingredientsService.list(
            { isDeleted: false },
            paginationQuery
        );

        return JsonResponse.success(
            {
                data: serialize(docs, IngredientSerialization),
                meta: paginationData,
            },
            res
        );
    };

    @SwaggerGet('/:id')
    @SwaggerResponse(IngredientSerialization)
    @SwaggerSummary('Get ingredient')
    @SwaggerDescription('Get ingredient by id')
    get = async (req: Request, res: Response) => {
        const data = await this.ingredientsService.findOneOrFail({
            _id: req.params.id,
            isDeleted: false
        });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), IngredientSerialization),
            },
            res
        );
    };

    @SwaggerPost()
    @SwaggerRequest(createIngredientsSchema)
    @SwaggerResponse(IngredientSerialization)
    @SwaggerSummary('Create ingredient')
    @SwaggerDescription('Create a new ingredient')
    create = async (req: Request, res: Response) => {
        const data = await this.ingredientsService.create(req.body);
        return JsonResponse.success(
            {
                status: 201,
                data: serialize(data.toJSON(), IngredientSerialization),
            },
            res
        );
    };

    @SwaggerPatch('/:id')
    @SwaggerRequest(updateIngredientsSchema)
    @SwaggerResponse(IngredientSerialization)
    @SwaggerSummary('Update ingredient')
    @SwaggerDescription('Update an ingredient by id')
    update = async (req: Request, res: Response) => {
        const data = await this.ingredientsService.updateOne(
            { _id: req.params.id },
            req.body
        );
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), IngredientSerialization),
            },
            res
        );
    };

    @SwaggerDelete('/:id')
    @SwaggerResponse(IngredientSerialization)
    @SwaggerSummary('Delete ingredient')
    @SwaggerDescription('Delete an ingredient by id')
    delete = async (req: Request, res: Response) => {
        const data = await this.ingredientsService.softDelete({ _id: req.params.id });
        return JsonResponse.success(
            {
                data: serialize(data.toJSON(), IngredientSerialization),
            },
            res
        );
    };
};
