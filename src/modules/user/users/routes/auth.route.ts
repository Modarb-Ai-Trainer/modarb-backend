import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { userValidation } from "../validation/user.Validation";
import { validator } from "../../../../helpers/validation.helper";

const app = express.Router();

// app.post("/register", validator(userValidation.createValidation), AuthController.register);
// app.post("/login", validator(userValidation.loginValidation), AuthController.login);

export { app as authRoutes };

