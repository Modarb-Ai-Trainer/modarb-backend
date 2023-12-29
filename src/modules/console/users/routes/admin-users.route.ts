import express from "express";
import { adminUsersController } from "../controllers/users.controller";
import { adminUserValidation } from "../validation/admin.userValidation";
import { validator } from "../../../../helpers/validation.helper";

const app = express.Router();

app.post("/create", validator(adminUserValidation.createValidation), adminUsersController.create);

export { app as adminUserRoutes };

