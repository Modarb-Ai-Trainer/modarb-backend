import { MealPlan } from "@common/models/meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { NutritionModel, INParams, INutritionPredictionItem } from "@lib/models/nutrition_model";
import { calcAge } from "@lib/utils/age";
import { MealsService } from "../../meals/services/meals.service";
import { UserRegisteredMealPlansService } from "../../user-registered-meal-plans/services/user-registered-meal-plans.service";

export class MealPlansService extends CrudService(MealPlan) {
    private mealsService = new MealsService();
    private userRegisteredMealPlansService = new UserRegisteredMealPlansService();

    public async createModelMealPlan(user: any) {
        let caloriesPerDay = 0;
        if (user.gender === "male") {
            caloriesPerDay = 10 * user.weight + 6.25 * user.height - 5 * calcAge(user.dob) + 5;
        } else {
            caloriesPerDay = 10 * user.weight + 6.25 * user.height - 5 * calcAge(user.dob) - 161;
        }

        const params: INParams = {
            calories: caloriesPerDay,
        };

        let pMealPlan: INutritionPredictionItem[][] = [];
        for (let i = 0; i < 4; i++) {
            const mealPlanChunk = await NutritionModel.predictMealPlan(params);
            pMealPlan = pMealPlan.concat(mealPlanChunk);
        }

        const mealsNames = pMealPlan.flat().map((meal) => meal.Name);
        const meals = await this.mealsService.listAll({ name: { $in: mealsNames } });

        const mealPlan = await this.create({
            aiGenerated: true,
            image: "https://placehold.co/300x400",
            description: `AI Generated Meal Plan (${new Date().toLocaleDateString()})`,
            duration: 28,
            level: user.fitness_level,
            your_journey: `Welcome to your personalized meal plan journey! As someone with a ${user.fitness_level} fitness level, this plan is tailored to meet your specific needs.`,
            key_features: [
                {
                    title: "Balanced Nutrition",
                    description: `Each meal provides a well-balanced mix of nutrients to support your health goals.`,
                },
                {
                    title: "Customizable Meals",
                    description: `Meals can be adjusted to fit your dietary preferences.`,
                },
                {
                    title: "Easy to Prepare",
                    description: `All meals are designed to be quick and easy to prepare.`,
                },
                {
                    title: "Variety and Flavor",
                    description: `Enjoy a diverse range of delicious meals.`,
                },
            ],
            days: pMealPlan.map((day, i) => ({
                day_number: i + 1,
                meals: day.map((m) => meals.find((meal) => meal.name === m.Name)?._id),
            })),
        });

        await this.userRegisteredMealPlansService.createForUser(
            {
                MealPlan: mealPlan._id,
            },
            user._id
        );

        return mealPlan;
    }
}
