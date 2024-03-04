import { JwtPayload, verify } from "jsonwebtoken";
import { Request } from "express";
import { HttpError } from "@lib/error-handling/http-error";
import { config } from "@configs/config";
import { IJwtLoginPayload } from "@common/interfaces/jwt-payload.interface";

export const UsersGuardMiddleware =
  () => (req: Request, res, next) => {
    // get token from cookie
    const token = req.headers.authorization?.split(" ")[1];
    let payload: IJwtLoginPayload;

    // validate token
    if (!token) {
      throw new HttpError(401, "Unauthorized");
    }

    try {
      payload = verify(token, config.jwt.secret);
    } catch (err) {
      throw new HttpError(401, "Unauthorized");
    }

    if (payload.type !== "user") {
      throw new HttpError(401, "Unauthorized");
    }


    // inject payload in request
    (req as unknown as { jwtPayload: JwtPayload }).jwtPayload = payload;

    // go on
    next();
  };
