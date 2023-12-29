import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { routes } from "./index.route";
import { connection as databaseConnection } from "./configs/database";

const main = async () => {
  // set up database connection
  databaseConnection();

  // set up express server
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // start server
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is up and running on port ${process.env.PORT}!`);
  });
};

main();
