import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Controller } from "@lib/decorators/controller.decorator";
import { Request, Response } from "express";
import { AdminsService } from "../services/admins.service";
import {
  ICreateAdmin,
  createAdminSchema,
} from "../validations/create-admin.validation";
import { parsePaginationQuery } from "@helpers/pagination";
import { JsonResponse } from "@lib/responses/json-response";
import { ControllerMiddleware } from "@lib/decorators/controller-middleware.decorator";
import { AdminGuardMiddleware } from "modules/console/common/guards/admins.guard";
import { Role } from "@common/enums/role.enum";
import { serialize } from "@helpers/serialize";
import { AdminSerialization } from "modules/console/common/serializers/admin.serialization";
import { IJSONSuccessResponse } from "@lib/responses/json-responses";
import {
  SwaggerDelete,
  SwaggerGet,
  SwaggerPatch,
  SwaggerPost,
} from "@lib/decorators/swagger-routes.decorator";
import { SwaggerResponse } from "@lib/decorators/swagger-response.decorator";
import { SwaggerRequest } from "@lib/decorators/swagger-request.decorator";
import { SwaggerSummary } from "@lib/decorators/swagger-summary.decorator";
import { SwaggerDescription } from "@lib/decorators/swagger-description.decorator";
import { SwaggerQuery } from "@lib/decorators/swagger-query.decorator";

@Controller("/console/admins")
@ControllerMiddleware(AdminGuardMiddleware({ roles: [Role.SUPER_ADMIN] }))
export class AdminsController extends BaseController {
  private adminsService = new AdminsService();

  setRoutes() {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",

      this.create
    );
    this.router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(createAdminSchema),
      asyncHandler(this.update)
    );
    this.router.delete(
      "/:id",
      paramsValidator("id"),
      asyncHandler(this.delete)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([AdminSerialization])
  @SwaggerSummary("List all admins")
  @SwaggerDescription("List all admins")
  list = async (
    req: Request,
    res: Response<IJSONSuccessResponse<AdminSerialization[]>>
  ): Promise<Response> => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.adminsService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, AdminSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/:id")
  @SwaggerResponse(AdminSerialization)
  @SwaggerSummary("Get admin by id")
  @SwaggerDescription("Get admin by id")
  get = async (
    req: Request<{ id: string }>,
    res: Response<IJSONSuccessResponse<AdminSerialization>>
  ): Promise<Response> => {
    const data = await this.adminsService.findOneOrFail({
      _id: req.params.id,
    });

    return JsonResponse.success(
      {
        data: serialize(data, AdminSerialization) as AdminSerialization,
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(AdminSerialization)
  @SwaggerRequest(createAdminSchema)
  @SwaggerSummary("Create new admin")
  @SwaggerDescription("Creates a new admin with role of admin")
  create = async (
    req: Request<{}, {}, ICreateAdmin>,
    res: Response<IJSONSuccessResponse<AdminSerialization>>
  ): Promise<Response> => {
    const admin = await this.adminsService.create(req.body);

    return JsonResponse.success(
      {
        status: 201,
        data: serialize(admin, AdminSerialization),
      },
      res
    );
  };

  @SwaggerPatch("/:id")
  @SwaggerResponse(AdminSerialization)
  @SwaggerRequest(createAdminSchema)
  @SwaggerSummary("Update admin")
  @SwaggerDescription("Updates an admin")
  update = async (
    req: Request<{ id: string }, {}, ICreateAdmin>,
    res: Response<IJSONSuccessResponse<AdminSerialization>>
  ): Promise<Response> => {
    const admin = await this.adminsService.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );

    return JsonResponse.success(
      {
        data: serialize(admin, AdminSerialization),
      },
      res
    );
  };

  @SwaggerDelete("/:id")
  @SwaggerResponse(AdminSerialization)
  @SwaggerSummary("Delete admin")
  @SwaggerDescription("Deletes an admin")
  delete = async (
    req: Request<{ id: string }>,
    res: Response<IJSONSuccessResponse<AdminSerialization>>
  ): Promise<Response> => {
    const admin = await this.adminsService.deleteOne({
      _id: req.params.id,
    });

    return JsonResponse.success(
      {
        data: serialize(admin, AdminSerialization),
      },
      res
    );
  };
}
