import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IExercise {
  name: string;
  category: string;
  duration?: number | null;
  expectedDurationRange: {
    min: number;
    max: number;
  };
  reps: number;
  sets: number;
  instructions: string;
  benefits: string;
  targetMuscles: string[]; // refs
  equipments: string[]; // refs
  media: {
    type: "image" | "video";
    url: string;
  };
}

const exerciseSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  category: { type: String, required: true },
  duration: { type: Number, required: false },
  expectedDurationRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  reps: { type: Number, required: true },
  sets: { type: Number, required: true },
  instructions: { type: String, required: true },
  benefits: { type: String, required: true },
  targetMuscles: [{ type: Schema.Types.ObjectId, ref: "muscles" }],
  equipments: [{ type: Schema.Types.ObjectId, ref: "equipments" }],
  media: {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: { type: String, required: true },
  },
});

export type ExerciseDocument = IExercise & mongoose.Document;

export const Exercise = mongoose.model<ExerciseDocument>(
  "exercises",
  exerciseSchema
);
