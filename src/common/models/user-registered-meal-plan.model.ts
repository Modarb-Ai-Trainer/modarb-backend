import mongoose from "mongoose";
const { Schema } = mongoose;
import { FitnessLevel } from "@common/enums/fitness-level.enum";

export interface IUserRegisteredMealPlan {
  user: string;
  isActive: boolean;
  meal_plan: string;
  createdAt?: Date;
  days: {
    day_number: number;
    meals: string[];
    is_eaten: boolean;
  }[];
}

const userRegisteredMealPlanSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  isActive: { type: Boolean, default: true },
  meal_plan: { type: mongoose.Types.ObjectId, ref: "mealPlans" },
  createdAt: { type: Date, default: Date.now, required: false },
  days: [
    {
      day_number: { type: Number, required: true, },
      meals: [
        { type: mongoose.Types.ObjectId, ref: "meals" },
      ],
      is_eaten: { type: Boolean, default: false }
    },
  ],
});


export type UserRegisteredMealPlanDocument = IUserRegisteredMealPlan & mongoose.Document;

export const UserRegisteredMealPlan = mongoose.model<UserRegisteredMealPlanDocument>(
  "userRegisteredMealPlans",
  userRegisteredMealPlanSchema
);
