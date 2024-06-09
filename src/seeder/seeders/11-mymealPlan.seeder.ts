import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { MealPlan } from "@common/models/meal-plan.model";
import { seederWrapper } from "seeder/helpers/seeder-wrapper";
import { User } from "@common/models/user.model";

export default seederWrapper(UserRegisteredMealPlan, async () => {
  const users = await User.find().lean();

  await Promise.all(users.map(async (user: any) => {
    const mealPlans = await MealPlan.find().lean();
    let index = Math.floor(Math.random() * mealPlans.length);
    const userRegisteredMealPlan = new UserRegisteredMealPlan({
      user: user._id,
      meal_plan: mealPlans[index]._id,
      is_active: true,
      days: mealPlans[index].days
    });
    await userRegisteredMealPlan.save();
  }));

});