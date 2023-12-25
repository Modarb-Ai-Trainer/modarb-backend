import express from "express";
import { authController } from "../controllers/auth.controller";
import { userValidation } from "../validation/user.Validation";
import { validator } from "../../../../helpers/validation.helper";

const app = express.Router();

app.post("/register", validator(userValidation.createValidation), authController.register);
app.post("/login", validator(userValidation.loginValidation), authController.login);

export { app as authRoutes };

