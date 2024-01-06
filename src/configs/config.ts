import { Env } from "./env";
import dotenv from "dotenv";
dotenv.config();

export interface Config {
  port: number;
  db: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  saltRounds: number;
}

export const config: Config = {
  port: Env.get("PORT", 4000).toNumber(),
  db: {
    uri: Env.get("DB_URI").toString(),
  },
  jwt: {
    secret: Env.get("JWT_SECRET").toString(),
    expiresIn: Env.get("JWT_EXPIRES_IN").toString(),
  },
  saltRounds: Env.get("SALT_ROUNDS", 5).toNumber(),
};
