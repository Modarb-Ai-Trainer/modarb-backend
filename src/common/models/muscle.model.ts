import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IMuscle {
  name: string;
  image: string;
  isDeleted: boolean;
}

const muscleSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  image: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

export type MuscleDocument = IMuscle & mongoose.Document;

export const Muscle = mongoose.model<MuscleDocument>(
  "muscles",
  muscleSchema
);
