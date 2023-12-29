import { usersService } from "../services/users.service";
import { jwtHelper } from "../../../../helpers/jwt.helper";
import { BaseController } from "../../../../lib/controllers/controller.base";
import { validator } from "../../../../helpers/validation.helper";
import { userValidation } from "../validation/user.Validation";
import { Router } from "express";
import { Prefix } from "../../../common/decorators/prefix.decorator";

@Prefix("/user")
export class AuthController extends BaseController {
  static setRoutes(router: Router): void {
    router.post(
      "/register",
      validator(userValidation.createValidation),
      AuthController.register
    );
    router.post(
      "/login",
      validator(userValidation.loginValidation),
      AuthController.login
    );
  }

  static async register(req, res) {
    try {
      let result = await usersService.create(req.body);
      return res.status(result.code).json(result);
    } catch (err) {
      console.log(`err.message`, err.message);
      return res.status(500).json({
        success: false,
        code: 500,
        error: err.message,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let result: {
        success: boolean;
        code: number;
        record?: any;
        message?: string;
      } = await usersService.comparePassword(email, password);
      if (!result.success) return res.status(result.code).json(result);
      let payload = {
        _id: result.record?._id,
        name: result.record?.name,
        email: result.record?.email,
        number: result.record?.number,
        role: result.record?.role,
      };
      const token = jwtHelper.generateToken(payload);
      return res.status(result.code).json({
        success: result.success,
        token,
        code: result.code,
        record: result.record,
      });
    } catch (err) {
      console.log(`err.message`, err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
