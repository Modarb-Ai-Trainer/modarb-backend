import { TemplateService } from "../services/templates.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { serialize } from "@helpers/serialize";
import { TemplateSerialization } from "@common/serializers/template.serialization";
import { TemplatePopulateSerialization } from "@common/serializers/templatePopulate.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import {
  SwaggerGet,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { createTemplatesSchema } from "../validations/create-templates.validation";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";


interface userRequest extends Request {
  jwtPayload?: any;
}

@Controller("/user/templates")
@ControllerMiddleware(UsersGuardMiddleware())
export class templateController extends BaseController {
  private templatesService = new TemplateService();

  setRoutes(): void {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",
      bodyValidator(createTemplatesSchema),
      asyncHandler(this.create)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([TemplatePopulateSerialization])
  @SwaggerSummary("my trainer --> custom workout")
  @SwaggerDescription("List all custom plans created by the user logged in")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
  })
  list = async (req: userRequest, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.templatesService.list(
      { user: req.jwtPayload.id },
      paginationQuery,
      {
        populateArray: [
          { path: "exercises" },
        ],
      }
    );

    return JsonResponse.success(
      {
        data: serialize(docs, TemplatePopulateSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(TemplatePopulateSerialization)
  @SwaggerSummary("Get custom plan")
  @SwaggerDescription("Get a single custom plan created by the user logged in")
  get = async (req: userRequest, res: Response): Promise<Response> => {
    const data = await this.templatesService.findOneOrFail(
      {
        _id: req.params.id,
        user: req.jwtPayload.id
      },
      {
        populateArray: [
          { path: "exercises" },
        ],
      });

    return JsonResponse.success(
      {
        data: serialize(data, TemplatePopulateSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(TemplateSerialization)
  @SwaggerRequest(createTemplatesSchema)
  @SwaggerSummary("Create custom plan")
  @SwaggerDescription("Create a new custom plan")
  create = async (req: userRequest, res: Response) => {
    const data = await this.templatesService.create(req.body);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data, TemplateSerialization),
      },
      res
    );
  };

}
