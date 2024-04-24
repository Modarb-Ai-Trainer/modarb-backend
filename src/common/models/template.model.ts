import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ITemplate {
    name: string;
    user: string;
    exercises: string[];
}

const templateSchema = new Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    exercises: [{ type: mongoose.Types.ObjectId, ref: "exercises" }],
});


export type TemplateDocument = ITemplate & mongoose.Document;

export const Template = mongoose.model<TemplateDocument>(
  "templates",
  templateSchema
);
