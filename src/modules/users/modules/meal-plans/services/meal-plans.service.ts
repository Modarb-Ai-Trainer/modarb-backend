import { MealPlan } from "@common/models/meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { NutritionModel, INParams, INutritionPredictionItem } from "@lib/models/nutrition_model";
import { calcAge } from "@lib/utils/age";
import { MealsService } from "../../meals/services/meals.service";
import { UserRegisteredMealPlansService } from "../../user-registered-meal-plans/services/user-registered-meal-plans.service";
import { UserDocument } from "@common/models/user.model";
import { UsersService } from "modules/console/modules/users/services/users.service";
import { Types } from "mongoose";

export class MealPlansService extends CrudService(MealPlan) {
    private mealsService = new MealsService();
    private userRegisteredMealPlansService = new UserRegisteredMealPlansService();
    private usersService = new UsersService();

    public async createModelMealPlan(userOrId: UserDocument | string) {
        const user: UserDocument = typeof userOrId === 'string' ?
                                  await this.usersService.findOneOrFail({_id: new Types.ObjectId(userOrId)}) :
                                  userOrId;

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
        const today = new Date();
        const todayDate = today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const currentTime = today.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        const milliseconds = today.getMilliseconds();
        

        const mealPlan = await this.create({
            aiGenerated: true,
            image: `https://t4.ftcdn.net/jpg/01/81/12/37/360_F_181123726_invADRiRZle7YWLYfkEHz0mUfWH60kVZ.jpg`,
            description: `This AI-generated meal plan is designed specifically for you, considering your personal fitness goal of ${user.preferences.fitness_goal}. 
            Created on ${todayDate} at ${currentTime}.${milliseconds}, this plan is tailored to provide a balanced and nutritious diet that supports your workout frequency of ${user.preferences.workout_frequency} times per week.
            Whether you prefer working out on ${user.preferences.preferred_days.join(", ")}, at ${user.preferences.workout_place}, or using ${user.preferences.preferred_equipment.join(", ")}, this meal plan will help you achieve your health and fitness goals. Enjoy a variety of delicious and nutritious meals selected just for you.`,
            duration: 28,
            level: user.fitness_level,
            days: pMealPlan.map((day, i) => ({
                day_number: i + 1,
                meals: day.map((m) => meals.find((meal) => meal.name === m.Name)?._id),
            })),
        });
        
        
        

        await this.userRegisteredMealPlansService.createForUser(
            {
                meal_plan: mealPlan._id,
            },
            user._id
        );

        

        return mealPlan;
    }
}
