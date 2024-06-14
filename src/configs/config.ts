import dotenv from "dotenv";
import { Env } from "@lib/env/env";
dotenv.config();

export interface Config {
  port: number;
  swaggerServer: string;
  host: string;
  db: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  saltRounds: number;
  modelsServerUrl: string;
}

export const config: Config = {
  port: Env.get("PORT", 7860).toNumber(),
  swaggerServer: Env.getOptional('SWAGGER_SERVER').toString(),
  host: Env.get("HOST", "http://localhost").toString(),
  db: {
    uri: Env.get("DB_URI").toString(),
  },
  jwt: {
    secret: Env.get("JWT_SECRET").toString(),
    expiresIn: Env.get("JWT_EXPIRES_IN").toString(),
  },
  saltRounds: Env.get("SALT_ROUNDS", 5).toNumber(),
  modelsServerUrl: `${Env.get("MODELS_HOST", 'http://127.0.0.1').toString()}:${Env.get("MODELS_PORT", '3030').toString()}`,
};
