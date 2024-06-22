import { config } from "@configs/config";

const endpoint = '/nutrition';

// Define the structure of a Nutrition Prediction Item
export interface INutritionPredictionItem {
  Calories: number;
  CarbohydrateContent: number;
  FatContent: number;
  Images: string[];
  Name: string;
  ProteinContent: number;
  RecipeIngredientParts: string[];
  RecipeInstructions: string[];
  type: string;
}

export interface INParams {
  calories: number
}

export class NutritionModel {
  public static async predictMealPlan(
    params: INParams
  ): Promise<INutritionPredictionItem[][]> {
    const response = await fetch(
      `${config.modelsServerUrl}${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      throw new Error("Failed to fetch data from the server");
    }

    return response.text().then((data) => {
      return JSON.parse(data) as INutritionPredictionItem[][];
    });
  }
}
