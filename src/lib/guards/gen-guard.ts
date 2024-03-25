import { IJwtLoginPayload } from "@common/interfaces/jwt-payload.interface";
import { JwtPayload, verify } from "jsonwebtoken";
import { HttpError } from "@lib/error-handling/http-error";
import { NextFunction, Request, Response } from "express";
import { config } from "@configs/config";

type OptionalIfUndefined<T> = [T] extends [undefined]
  ? (args?: T) => void
  : (args: T) => void;

export const genGuard =
  <T = undefined>(
    validationMethod?: (
      validationArgs: T,
      payload: IJwtLoginPayload,
      req: Request,
      res: Response
    ) => boolean | Promise<boolean>
  ): OptionalIfUndefined<T> =>
    (args: T) =>
      async (req: Request, res: Response, next: NextFunction) => {
        // get token from cookie
        const token = req.headers.authorization?.split(" ")[1];
        let payload: IJwtLoginPayload;

        // validate token
        if (!token) {
          return next(new HttpError(401, "Unauthorized"));
        }

        try {
          payload = verify(token, config.jwt.secret);
        } catch (err) {
          return next(new HttpError(401, "Unauthorized"));
        }

        if (
          validationMethod &&
          !(await validationMethod(args, payload, req, res))
        ) {
          return next(new HttpError(401, "Unauthorized"));
        }

        // inject payload in request
        (req as unknown as { jwtPayload: JwtPayload }).jwtPayload = payload;

        // go on
        next();
      };
