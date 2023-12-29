import express from "express";

import { userRoutes } from "./modules/user/index.route";
import { adminRoutes } from "./modules/console/index.route";

const mainRouter = express.Router();

mainRouter.use("/user", userRoutes);
mainRouter.use("/admin", adminRoutes);

mainRouter.get("/", (_req: any, res: any) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome Message", code: 200 });
});

mainRouter.get("/health", (_req: any, res: any) => {
  res.status(200).json({ success: true, message: "Server is up!", code: 200 });
});

mainRouter.all("*", (_req: any, res: any) => {
  res.status(404).json({ success: false, message: "Invalid URL!", code: 404 });
});

export { mainRouter };
