import { asyncHandler } from "@helpers/async-handler";
import { paramsValidator, bodyValidator } from "@helpers/validation.helper";
import { BaseController } from "@lib/controllers/controller.base";
import { Prefix } from "@lib/decorators/prefix.decorator";
import { Request, Response, Router } from "express";
import { AdminsService } from "../services/admins.service";
import { createAdminSchema } from "../validations/create-admin.validation";
import { parsePaginationQuery } from "@helpers/pagination";
import { JsonResponse } from "@lib/responses/json-response";

@Prefix("/console/admins")
export class AdminsController extends BaseController {
  private adminsService = new AdminsService();

  setRoutes() {
    this.router.get("/", asyncHandler(this.list));
    this.router.get("/:id", paramsValidator("id"), asyncHandler(this.get));
    this.router.post(
      "/",
      bodyValidator(createAdminSchema),
      asyncHandler(this.create)
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

  list = async (req: Request, res: Response) => {
    const paginationQuery = parsePaginationQuery(req.query);
    const { docs, paginationData } = await this.adminsService.list(
      {},
      paginationQuery
    );
    const response = new JsonResponse({
      data: docs,
      meta: paginationData,
    });
    return res.json(response);
  };

  get = async (req: Request, res: Response) => {
    const data = await this.adminsService.findOneOrFail({
      _id: req.params.id,
    });
    const response = new JsonResponse({
      data,
    });
    res.json(response);
  };

  create = async (req: Request, res: Response) => {
    const admin = await this.adminsService.create(req.body);
    const response = new JsonResponse({
      data: admin,
    });
    res.json(response);
  };

  update = async (req: Request, res: Response) => {
    const admin = await this.adminsService.update(
      {
        _id: req.params.id,
      },
      req.body
    );

    const response = new JsonResponse({
      data: admin,
    });

    res.json(response);
  };

  delete = async (req: Request, res: Response) => {
    const admin = await this.adminsService.delete({
      _id: req.params.id,
    });

    const response = new JsonResponse({
      data: admin,
    });

    res.json(response);
  };
}
