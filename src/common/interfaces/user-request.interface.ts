import { Request } from "express";
import { IJwtLoginPayload } from "./jwt-payload.interface";

export interface IUserRequest extends Request {
  jwtPayload?: IJwtLoginPayload;
}
