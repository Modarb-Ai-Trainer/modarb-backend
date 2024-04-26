import mongoose from "mongoose";
import { config } from "./config";

export const connectDatabase = async () => {
  return mongoose.connect(config.db.uri).then((o) => {
    console.log(`Connected to MongoDB database successfully!`);
    return o;
  });
};
