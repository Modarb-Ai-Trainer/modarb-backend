import express from "express";
import cors from "cors";
import { connectDatabase } from "./configs/database";
import { config } from "./configs/config";
import { setAppRoutes } from "./routes";

const main = async () => {
  // set up database connection
  await connectDatabase();

  // set up express server
  const app = express();

  // set up middlewares
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // set up routes
  await setAppRoutes(app);

  // start server
  app.listen(config.port, () => {
    console.log(`Server is up and running on port ${config.port}!`);
  });
};

main();
