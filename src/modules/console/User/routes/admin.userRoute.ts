import express from "express";
import { adminUserController } from "../controllers/user.controller";
import { adminUserValidation } from "../validation/admin.userValidation";
import { validator } from "../../../../helpers/validation.helper";

const app = express.Router();

app.post("/create", validator(adminUserValidation.createValidation), adminUserController.create);

export { app as adminUserRoutes };

