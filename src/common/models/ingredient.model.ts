import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IIngredient {
  name: string;
  serving_size: number;
  servings_count: number;
  serving_size_unit: string;
  servings_count_unit: string;
  calories: number;
  carbs: number;
  proteins: number;
  fats: number;
  isDeleted: boolean;
}

const ingredientSchema = new Schema({
  name: { type: String, required: true, unique: true, dropDups: true },
  serving_size: { type: Number, required: true },
  servings_count: { type: Number, required: true },
  serving_size_unit: { type: String, required: true },
  servings_count_unit: { type: String, required: true },
  calories: { type: Number, required: true },
  carbs: { type: Number, required: true },
  proteins: { type: Number, required: true },
  fats: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
});


export type IngredientDocument = IIngredient & mongoose.Document;

export const Ingredient = mongoose.model<IngredientDocument>(
  "ingredients",
  ingredientSchema
);
