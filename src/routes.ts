import { Router, Express } from "express";

import * as glob from "glob";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { BaseController } from "./lib/controllers/controller.base";
import { validationErrorHandler } from "./helpers/validation.helper";
import { JsonResponse } from "@lib/responses/json-response";
import { errorHandlerMiddleware } from "middlewares/error-handler.middleware";
import { swaggerRegistry } from "@lib/swagger/swagger";

/**
 * Sets the routes for the Express app.
 *
 * @param app - The Express app.
 */
export const setAppRoutes = async (app: Express) => {
  const mainRouter = Router();

  await importControllers(mainRouter);
  await setCustomRoutes(mainRouter);

  app.use("/api/v1", mainRouter);
};

/* custom routes */

/**
 * Sets custom routes for the router.
 *
 * @param router - The router object to set the routes on.
 */
const setCustomRoutes = async (router: Router) => {
  // Health check route
  router.get("/health", (_req: any, res: any) => {
    JsonResponse.success(
      {
        message: "Server is up!",
        data: { success: true },
      },
      res
    );
  });

  // Validation error handler
  router.use(validationErrorHandler);

  // docs
  router.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerRegistry.generateSwaggerDocument())
  );

  // Invalid URL handler
  router.all("*", (req: any, res: any) => {
    JsonResponse.error(
      {
        error: "Invalid URL!",
        status: 404,
      },
      res
    );
  });

  // Error handler
  router.use(errorHandlerMiddleware);
};

/* importing all controllers */

/**
 * Finds all controller files in the project.
 * @returns An array of strings representing the absolute paths of the controller files.
 */
const findControllerFiles = (): string[] => {
  const controllersPath = path
    .relative(process.cwd(), path.join(__dirname, "**/*.controller.{ts,js}"))
    .replace(/\\/g, "/");

  return glob.sync(controllersPath, {}).map((file) => {
    return path.resolve(file);
  });
};

/**
 * Imports controller classes from files, sets up routes for each controller,
 * and adds them to the provided router.
 *
 * @param router - The router to add the routes to.
 */
const importControllers = async (router: Router) => {
  const files = findControllerFiles();

  console.log("importing controllers...");
  await Promise.all(
    files.map(async (file) => {
      const controllerClass = await importController(file);

      if (!controllerClass) return;
      const controller: BaseController = new (controllerClass as any)();
      controller.setRoutes();
      router.use(controller.prefix, controller.router);
    })
  );
  console.log("controllers imported!");
};

/**
 * Imports a module from a file and returns the first controller that extends BaseController.
 * @param file - The path to the file containing the module.
 * @returns The first controller that extends BaseController.
 */
const importController = async (file: string) => {
  const controllers = Object.values(await import(file));
  return controllers.find(
    (controller: { prototype: typeof BaseController }) =>
      controller.prototype instanceof BaseController
  ) as typeof BaseController;
};
