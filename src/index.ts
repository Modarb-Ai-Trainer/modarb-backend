import express from "express";
import cors from "cors";
import { routes } from "./index.route";
import { connectDatabase } from "./configs/database";
import { config } from "./configs/config";

const main = async () => {
  // set up database connection
  connectDatabase();

  // set up express server
  const app = express();

  // set up middlewares
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // set up routes
  app.use(routes);

  // start server
  app.listen(config.port, () => {
    console.log(`Server is up and running on port ${config.port}!`);
  });
};

main();
