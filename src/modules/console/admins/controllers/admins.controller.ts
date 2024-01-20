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

  list(_, res: Response) {
    AdminsService.list({})
      .then((result) => {
        res.status(result.code).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  async get(req: Request, res: Response) {
    const data = await AdminsService.get({
      _id: req.params.id,
    });
    res.json(data);
  }

  async create(req: Request, res: Response) {
    const data = await AdminsService.create(req.body);
    res.json(data);
  }

  async update(req: Request, res: Response) {
    const data = await AdminsService.update(req.params.id, req.body);
    res.json(data);
  }

  async delete(req: Request, res: Response) {
    const data = await AdminsService.remove(req.params.id);
    res.json(data);
  }
}
