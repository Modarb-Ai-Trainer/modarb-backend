import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { IMeal, Meal } from "@common/models/meal.model";
import { dbStore } from "seeder/helpers/db-store";
import { MealType } from "@common/enums/meal-type.enum";
import { Ingredient } from "@common/models/ingredient.model";

export default seederWrapper(Meal, async () => {
  console.log('fetching ingredients ids...')
  const ingredientsIds = await Promise.all(
    dbStore.ingredientsNames.map(
      async name => {
        const ing = await Ingredient.findOne(({name}));
        return {
          name,
          _id: ing._id
        }
      }
    )
  )

  console.log('preping meals data...')
  const data = await Promise.all(dbStore.mealsDataset.map(async (mealJson) => ({
    name: mealJson.Name,
    created_at: new Date(),
    image: mealJson.Images[0],
    ingredients: mealJson.RecipeIngredientParts.map(name => ingredientsIds.find(i => i.name === name)._id),
    calories: mealJson.Calories,
    carbs: mealJson.CarbohydrateContent,
    proteins: mealJson.ProteinContent,
    fats: mealJson.FatContent,
    type: mealJson.type?.toLowerCase() as MealType,
  } satisfies Partial<IMeal>)));

  console.log('inserting meals...')
  await Meal.insertMany(data);
});

