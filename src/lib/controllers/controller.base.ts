import { Router } from "express";

export abstract class BaseController {
  public static router: Router = Router();
  public static prefix: string = "/";

  public static setRoutes(_router: Router) {
    throw new Error(`routes not set for ${this.name}`);
  }
}
