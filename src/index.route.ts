import express from "express";

const app = express.Router();

import { userRoutes } from "./modules/user/index.route";
import { adminRoutes } from "./modules/console/index.route";

// set prefix for all routes
const v1Router = express.Router();

v1Router.use("/user", userRoutes);
v1Router.use("/admin", adminRoutes);

v1Router.get("/", (_req: any, res: any) => {
  res
    .status(200)
    .json({ success: true, message: "Welcome Message", code: 200 });
});

v1Router.get("/health", (_req: any, res: any) => {
  res.status(200).json({ success: true, message: "Server is up!", code: 200 });
});

v1Router.all("*", (_req: any, res: any) => {
  res.status(404).json({ success: false, message: "Invalid URL!", code: 404 });
});

app.use("/api/v1", v1Router);

export { app as routes };
