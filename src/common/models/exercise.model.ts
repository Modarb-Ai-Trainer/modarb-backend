import { ExerciseType } from "@common/enums/exercise-type.enum";
import mongoose, { ObjectId } from "mongoose";
const { Schema } = mongoose;

export interface IExercise {
  name: string;
  category: string;
  duration?: number | null;
  exerciseType: ExerciseType;
  expectedDurationRange: {
    min: number;
    max: number;
  };
  reps?: number;
  sets?: number;
  instructions: string;
  benefits: string;
  targetMuscles: {
    primary: ObjectId;
    secondary: ObjectId;
  }
  equipments: ObjectId[];
  coverImage: string;
  media: {
    type: "image" | "video";
    url: string;
  };
}

const exerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true, unique: true, dropDups: true },
  category: { type: String, required: true },
  duration: { type: Number, required: false },
  exerciseType: {
    type: String,
    required: false,
    enum: ExerciseType
  },
  expectedDurationRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  reps: { type: Number, required: false },
  sets: { type: Number, required: false },
  instructions: { type: String, required: true },
  benefits: { type: String, required: true },
  targetMuscles: {
    primary: { type: Schema.Types.ObjectId, ref: "muscles" },
    secondary: { type: Schema.Types.ObjectId, ref: "muscles" },
  },
  equipments: [{ type: Schema.Types.ObjectId, ref: "equipments" }],
  coverImage: { type: String, required: true },
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
