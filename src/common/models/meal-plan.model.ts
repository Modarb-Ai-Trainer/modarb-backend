import mongoose from "mongoose";
const { Schema } = mongoose;
import { FitnessLevel } from "@common/enums/fitness-level.enum";

export interface IMealPlan {
  image: string;
  description: string;
  Duration: number;
  Level: FitnessLevel;
  your_Journey: string;
  key_Features: {
    title: string;
    description: string;
  }[];
  days: {
    day_number: number;
    meals: mongoose.Types.ObjectId[];
  }[];
}

const mealPlanSchema = new Schema({
  Image: { type: String, required: true },
  description: { type: String, required: true },
  Duration: { type: Number, required: true },
  Level: { type: String, enum: FitnessLevel, required: true },
  your_Journey: { type: String, required: true },
  key_Features: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
  }],
  days: [
    {
      day_number: { type: Number, required: true, },
      meals: [
        { type: mongoose.Types.ObjectId, ref: "meals" },
      ],
    },
  ],
});


export type MealPlanDocument = IMealPlan & mongoose.Document;

export const MealPlan = mongoose.model<MealPlanDocument>(
  "mealPlans",
  mealPlanSchema
);
