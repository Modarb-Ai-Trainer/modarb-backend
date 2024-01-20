import { Router } from "express";

export abstract class BaseController {
  public router: Router = Router();
  public prefix: string = "/";

  public abstract setRoutes(): void;
}
