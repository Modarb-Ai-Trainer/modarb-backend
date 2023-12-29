import express from "express";
const adminRouter = express.Router();

import { jwtHelper } from "../../helpers/jwt.helper";
const allowedRoles = ["superAdmin", "admin"];

import { adminUserRoutes } from "./users/routes/admin-users.route";

adminRouter.use("/users", jwtHelper.verifyToken(allowedRoles), adminUserRoutes);

export { adminRouter };
