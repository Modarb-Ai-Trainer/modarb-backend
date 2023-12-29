import mongoose from "mongoose";
import { config } from "./config";

export const connectDatabase = async () => {
  return mongoose
    .connect(config.db.uri)
    .then(() => {
      console.log(`Connected to MongoDB database successfully!`);
    })
    .catch((err) => {
      console.error("MongoDB Error: ", err);
    });
};
