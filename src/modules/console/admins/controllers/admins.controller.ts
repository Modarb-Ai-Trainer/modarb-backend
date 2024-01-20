import { Request, Response, Router } from "express";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../common/decorators/prefix.decorator";
import { AdminsService } from "../services/admins.service";
import { createAdminSchema } from "../validations/create-admin.validation";
import {
  bodyValidator,
  paramsValidator,
} from "../../../../helpers/validation.helper";

@Prefix("/console/admins")
export class AdminsController extends BaseController {
  private adminsService = new AdminsService();

  setRoutes() {
    this.router.get("/", this.list);
    this.router.get("/:id", paramsValidator("id"), this.get);
    this.router.post("/", bodyValidator(createAdminSchema), this.create);
    this.router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(createAdminSchema),
      this.update
    );
    this.router.delete("/:id", paramsValidator("id"), this.delete);
  }

  list = (_, res: Response) => {
    this.adminsService
      .list({})
      .then((result) => {
        res.status(result.code).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  get = async (req: Request, res: Response) => {
    const data = await this.adminsService.get({
      _id: req.params.id,
    });
    res.json(data);
  };

  create = async (req: Request, res: Response) => {
    const data = await this.adminsService.create(req.body);
    res.json(data);
  };

  update = async (req: Request, res: Response) => {
    const data = await this.adminsService.update(req.params.id, req.body);
    res.json(data);
  };

  delete = async (req: Request, res: Response) => {
    const data = await this.adminsService.remove(req.params.id);
    res.json(data);
  };
}
