import mongoose from "mongoose";
const { Schema } = mongoose;
import { FitnessLevel } from "@common/enums/fitness-level.enum";

export interface IMealPlan {
  image: string;
  description: string;
  duration: number;
  level: FitnessLevel;
  your_journey: string;
  key_features: {
    title: string;
    description: string;
  }[];
  days: {
    day_number: number;
    meals: mongoose.Types.ObjectId[];
  }[];
}

const mealPlanSchema = new Schema({
  image: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  level: { type: String, enum: FitnessLevel, required: true },
  your_journey: { type: String, required: true },
  key_features: [{
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
