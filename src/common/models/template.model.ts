import { date } from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ITemplate {
  name: string;
  user: string;
  creationDate: Date;
  exercises: string[];
}

const templateSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  creationDate: { type: Date, default: Date.now() },
  exercises: [{ type: mongoose.Types.ObjectId, ref: "exercises" }],
});


export type TemplateDocument = ITemplate & mongoose.Document;

export const Template = mongoose.model<TemplateDocument>(
  "templates",
  templateSchema
);
