import * as path from "path";
const fs = require('fs')

export interface IMealJson {
    Name: string;
    RecipeIngredientParts: string[];
    Calories: number;
    CarbohydrateContent: number;
    ProteinContent: number;
    FatContent: number;
    Images: string[];
    type: string;
}

const filePath = path.join(__dirname, '../../resources/meals.json');

export const loadMealsDataset = (): IMealJson[] => {
  let data: IMealJson[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // remove duplicates by name
  const uniqueNames = new Set(data.map(e => e.Name));
  data = data.filter(e => {
    const found = uniqueNames.has(e.Name)
    uniqueNames.delete(e.Name);
    return found;
  });

  console.log(`Loaded ${data.length} meals from dataset`)
  return data;
}
