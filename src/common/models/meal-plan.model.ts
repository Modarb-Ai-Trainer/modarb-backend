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
  aiGenerated: boolean;
  isDeleted: boolean;
  createdAt?: Date;
}

const mealPlanSchema = new Schema({
  image: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  level: { type: String, enum: FitnessLevel, required: true },
  your_journey: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, required: false },
  key_features: [{
    title: { type: String, required: false },
    description: { type: String, required: false },
  }],
  days: [
    {
      day_number: { type: Number, required: true, },
      meals: [
        { type: mongoose.Types.ObjectId, ref: "meals" },
      ],
    },
  ],
  aiGenerated: { type: Boolean, required: true, default: false },
  isDeleted: { type: Boolean, default: false },
});


export type MealPlanDocument = IMealPlan & mongoose.Document;

export const MealPlan = mongoose.model<MealPlanDocument>(
  "mealPlans",
  mealPlanSchema
);
