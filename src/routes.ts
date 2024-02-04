import { Router, Express } from "express";

import * as glob from "glob";
import path from "path";
import { BaseController } from "./lib/controllers/controller.base";
import { validationErrorHandler } from "./helpers/validation.helper";

export const setAppRoutes = async (app: Express) => {
  const mainRouter = Router();

  await importControllers(mainRouter);
  setCustomRoutes(mainRouter);

  app.use("/api/v1", mainRouter);
};

/* custom routes */

const setCustomRoutes = (router: Router) => {
  router.get("/health", (_req: any, res: any) => {
    res
      .status(200)
      .json({ success: true, message: "Server is up!", code: 200 });
  });

  router.use(validationErrorHandler);

  router.all("*", (_req: any, res: any) => {
    res
      .status(404)
      .json({ success: false, message: "Invalid URL!", code: 404 });
  });
};

/* importing all controllers */

const findControllerFiles = (): string[] => {
  const controllersPath = path.relative(process.cwd(), path.join(__dirname, "**/*.controller.{ts,js}")).replace(/\\/g, "/")
  
  return glob.sync(controllersPath, {}).map((file) => {
    return path.resolve(file);
  });
};


const importControllers = async (router: Router) => {
  const files = findControllerFiles();

  await Promise.all(
    files.map(async (file) => {
      const controllerClass = await importController(file);

      if (!controllerClass) return;
      const controller: BaseController = new (controllerClass as any)();
      controller.setRoutes();
      router.use(controller.prefix, controller.router);
    })
  );
};

const importController = async (file: string) => {
  const controllers = Object.values(await import(file));
  return controllers.find(
    (controller: { prototype: typeof BaseController }) =>
      controller.prototype instanceof BaseController
  ) as typeof BaseController;
};
