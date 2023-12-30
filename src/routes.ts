import { Router, Express } from "express";

import * as glob from "glob";
import path from "path";
import { BaseController } from "./lib/controllers/controller.base";

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

  router.all("*", (_req: any, res: any) => {
    res
      .status(404)
      .json({ success: false, message: "Invalid URL!", code: 404 });
  });
};

/* importing all controllers */

const findControllerFiles = (): string[] => {
  return glob.sync(path.join(__dirname, "**/*.controller.{ts,js}"));
};

const importControllers = async (router: Router) => {
  const files = findControllerFiles();

  await Promise.all(
    files.map(async (file) => {
      const controller = await importController(file);
      if (!controller) return;
      controller.setRoutes(controller.router);
      router.use(controller.prefix, controller.router);
    })
  );
};

const importController = async (file: string) => {
  const controllers = Object.values(await import(file));
  return controllers.find(
    (controller: { router?: Router }) => controller.router
  ) as typeof BaseController;
};
