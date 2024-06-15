import mongoose from "mongoose";
const { Schema } = mongoose;
import { MealType } from "@common/enums/meal-type.enum";
export interface IMeal {
  name: string;
  created_at: Date;
  image: string;
  ingredients: string[];
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  type: MealType;
}

const mealSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  created_at: { type: Date, default: Date.now() },
  image: { type: String, required: true },
  type: {
    type: String,
    enum: MealType,
    required: true,
  },
  ingredients: [{ type: mongoose.Types.ObjectId, ref: "ingredients" }],
  calories: { type: Number, required: true },
  carbs: { type: Number, required: true },
  proteins: { type: Number, required: true },
  fats: { type: Number, required: true },
});


export type MealDocument = IMeal & mongoose.Document;

export const Meal = mongoose.model<MealDocument>(
  "meals",
  mealSchema
);
