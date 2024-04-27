import dotenv from "dotenv";
import { Env } from "@lib/env/env";
dotenv.config();

export interface Config {
  port: number;
  host: string;
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
  host: Env.get("HOST", "http://localhost").toString(),
  db: {
    uri: Env.get("DB_URI").toString(),
  },
  jwt: {
    secret: Env.get("JWT_SECRET").toString(),
    expiresIn: Env.get("JWT_EXPIRES_IN").toString(),
  },
  saltRounds: Env.get("SALT_ROUNDS", 5).toNumber(),
};
