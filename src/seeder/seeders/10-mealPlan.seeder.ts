import { MealPlan } from "@common/models/meal-plan.model";
import { Meal } from "@common/models/meal.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { FitnessLevel } from "@common/enums/fitness-level.enum";

export default seederWrapper(MealPlan, async () => {
  // 10 mealPlans
  await Promise.all(Array.from({ length: 10 }, (_, i) => i).map(async function (i) {
    // Fetch all meals
    const meals = await Meal.find().lean();

    // Categorize meals by type
    const categorizedMeals = {
      'breakfast': [],
      'dinner': [],
      'snacks': [],
      'lunch': [],
    };


    meals.forEach(meal => {
      if (meal.type in categorizedMeals) {
        categorizedMeals[meal.type].push(meal);
      }
    });

    // Check if we have enough meals of each type
    for (const type in categorizedMeals) {
      if (categorizedMeals[type].length < 7) {
        throw new Error(`Not enough meals of type ${type}`);
      }
    }

    let o = {
      image: `https://placehold.co/300x400`,
      description: 'This is a description of the meal plan.',
      duration: 7,
      level: [FitnessLevel.BEGINNER, FitnessLevel.INTERMEDIATE, FitnessLevel.ADVANCED][i % 3],
      your_journey: 'This is your journey description.',
      key_features: [
        { title: 'Feature 1', description: 'Description for feature 1' },
        { title: 'Feature 2', description: 'Description for feature 2' },
      ],
      days: Array.from({ length: 7 }, (_, i) => ({
        day_number: i + 1,
        meals: [
          categorizedMeals['breakfast'][i],
          categorizedMeals['lunch'][i],
          categorizedMeals['dinner'][i],
          categorizedMeals['snacks'][i],
        ],
      })),
    }

    await MealPlan.create(o);
  }));
});
