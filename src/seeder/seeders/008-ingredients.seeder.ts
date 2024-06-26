import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { dbStore } from "seeder/helpers/db-store";
import { IIngredient, Ingredient } from "@common/models/ingredient.model";
import { faker } from '@faker-js/faker';

export default seederWrapper(Ingredient, async () => {
  const data = await Promise.all(dbStore.ingredientsNames.map(async (ingredientName) => ({
    name: ingredientName,
    serving_size: faker.number.int({ min: 5, max: 20 }),
    servings_count: faker.number.int({ min: 1, max: 5 }),
    serving_size_unit: "Grams",
    servings_count_unit: "servings",
    calories: faker.number.int({ min: 10, max: 20 }),
    carbs: faker.number.int({ min: 10, max: 20 }),
    proteins: faker.number.int({ min: 10, max: 20 }),
    fats: faker.number.int({ min: 10, max: 20 }),
    isDeleted: false,
  } satisfies Partial<IIngredient>)));

  await Ingredient.insertMany(data);
});

