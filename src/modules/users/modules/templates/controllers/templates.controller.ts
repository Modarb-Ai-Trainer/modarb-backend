import { TemplateService } from "../services/templates.service";
import { Request, Response } from "express";
import { JsonResponse } from "@lib/responses/json-response";
import { parsePaginationQuery } from "@helpers/pagination";
import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/prefix.decorator";
import { serialize } from "@helpers/serialize";
import { TemplateSerialization } from "@common/serializers/template.serialization";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { UsersGuardMiddleware } from "modules/users/common/guards/users.guard";
import {
  SwaggerGet,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { createTemplatesSchema } from "../validations/create-templates.validation";
import { updateTemplatesSchema } from "../validations/update-templates.validation";


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
  @SwaggerResponse([TemplateSerialization])
  list = async (req: userRequest, res: Response): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.templatesService.list(
      { user: req.jwtPayload.id },
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, TemplateSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(TemplateSerialization)
  get = async (req: userRequest, res: Response): Promise<Response> => {
    const data = await this.templatesService.findOneOrFail({
      _id: req.params.id,
      user: req.jwtPayload.id
    });

    return JsonResponse.success(
      {
        data: serialize(data, TemplateSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(TemplateSerialization)
  @SwaggerRequest(createTemplatesSchema)
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
