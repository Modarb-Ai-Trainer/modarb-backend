import { Env } from "./env";
import dotenv from "dotenv";
dotenv.config();

export interface Config {
  port: number;
  db: {
    uri: string;
  };
}

export const config: Config = {
  port: Env.get("PORT", 4000).toNumber(),
  db: {
    uri: Env.get("DB_URI").toString(),
  },
};
