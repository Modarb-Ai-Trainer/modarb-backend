import jwt from "jsonwebtoken";
import { config } from "../configs/config";
import { IJwtLoginPayload } from "@common/interfaces/jwt-payload.interface";

export class JwtHelper {
  static generateToken(payload: IJwtLoginPayload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  static verifyToken(role: any) {
    return (req: any, res: any, next: any) => {
      let authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, code: 401, message: "Unauthorized" });
      }
      jwt.verify(token, config.jwt.secret, (err: any, tokenData: any) => {
        if (err)
          return res
            .status(403)
            .json({ success: false, code: 403, message: "Invalid Token!" });
        if (!role.includes(tokenData.role))
          return res
            .status(401)
            .json({ success: false, code: 401, message: "Unauthorized" });
        req.tokenData = tokenData;
        next();
      });
    };
  }
}
