import { Request, Response, Router } from "express";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { Prefix } from "../../../common/decorators/prefix.decorator";
import { AdminsService } from "../services/admins.service";
import { createAdminSchema } from "../validations/create-admin.validation";
import {
  bodyValidator,
  paramsValidator,
} from "../../../../helpers/validation.helper";

@Prefix("/admins")
export class AdminsController extends BaseController {
  static setRoutes(router: Router) {
    router.get("/", AdminsController.list);
    router.get("/:id", paramsValidator("id"), AdminsController.get);
    router.post("/", bodyValidator(createAdminSchema), AdminsController.create);
    router.patch(
      "/:id",
      paramsValidator("id"),
      bodyValidator(createAdminSchema),
      AdminsController.update
    );
    router.delete("/:id", paramsValidator("id"), AdminsController.delete);
  }

  static list(_, res: Response) {
    AdminsService.list({})
      .then((result) => {
        res.status(result.code).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static async get(req: Request, res: Response) {
    const data = await AdminsService.get({
      _id: req.params.id,
    });
    res.json(data);
  }

  static async create(req: Request, res: Response) {
    const data = await AdminsService.create(req.body);
    res.json(data);
  }

  static async update(req: Request, res: Response) {
    const data = await AdminsService.update(req.params.id, req.body);
    res.json(data);
  }

  static async delete(req: Request, res: Response) {
    const data = await AdminsService.remove(req.params.id);
    res.json(data);
  }
}
