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
import { EquipmentsService } from "../services/equipments.service";
import { createEquipmentSchema } from "../validations/create-equipment.validation";
import { updateEquipmentSchema } from "../validations/update-equipment.validation";
import { EquipmentSerialization } from "@common/serializers/muscle.serialization";
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
@Controller("/console/equipments")
@ControllerMiddleware(AdminGuardMiddleware({}))
export class EquipmentsController extends BaseController {
  private equipmentsService = new EquipmentsService();

  setRoutes() {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",
      bodyValidator(createEquipmentSchema),
      asyncHandler(this.create)
    );
    this.router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(updateEquipmentSchema),
      asyncHandler(this.update)
    );
    this.router.delete(
      "/:id",
      paramsValidator("id"),
      asyncHandler(this.delete)
    );
  }

  @SwaggerGet()
  @SwaggerResponse([EquipmentSerialization])
  @SwaggerSummary("List equipments")
  @SwaggerDescription("List all equipments in the system")
  @SwaggerQuery({
    limit: "number",
    skip: "number",
  })
  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.equipmentsService.list(
      {},
      paginationQuery
    );

    return JsonResponse.success(
      {
        data: serialize(docs, EquipmentSerialization),
        meta: paginationData,
      },
      res
    );
  };

  @SwaggerGet("/{id}")
  @SwaggerResponse(EquipmentSerialization)
  @SwaggerSummary("Get equipment")
  @SwaggerDescription("Get a single equipment by id")
  get = async (req: Request, res: Response) => {
    const data = await this.equipmentsService.findOneOrFail({
      _id: req.params.id,
    });
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), EquipmentSerialization),
      },
      res
    );
  };

  @SwaggerPost()
  @SwaggerResponse(EquipmentSerialization)
  @SwaggerRequest(createEquipmentSchema)
  @SwaggerSummary("Create equipment")
  @SwaggerDescription("Create a new equipment")
  create = async (req: Request, res: Response) => {
    const data = await this.equipmentsService.create(req.body);
    return JsonResponse.success(
      {
        status: 201,
        data: serialize(data.toJSON(), EquipmentSerialization),
      },
      res
    );
  };

  @SwaggerPatch("/{id}")
  @SwaggerResponse(EquipmentSerialization)
  @SwaggerRequest(updateEquipmentSchema)
  @SwaggerSummary("Update equipment")
  @SwaggerDescription("Update a equipment by id")
  update = async (req: Request, res: Response) => {
    const data = await this.equipmentsService.updateOne(
      { _id: req.params.id },
      req.body
    );
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), EquipmentSerialization),
      },
      res
    );
  };

  @SwaggerDelete("/{id}")
  @SwaggerResponse(EquipmentSerialization)
  @SwaggerSummary("Delete equipment")
  @SwaggerDescription("Delete a equipment by id")
  delete = async (req: Request, res: Response) => {
    const data = await this.equipmentsService.deleteOne({ _id: req.params.id });
    return JsonResponse.success(
      {
        data: serialize(data.toJSON(), EquipmentSerialization),
      },
      res
    );
  };
}
