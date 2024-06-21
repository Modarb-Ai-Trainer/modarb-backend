import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { MealPlan } from "@common/models/meal-plan.model";



export class UserRegisteredMealPlansService extends CrudService(UserRegisteredMealPlan) {
  private mealPlansService = new (CrudService(MealPlan))()

  async unregisterCurrentMealPlan(userId: string) {
    return await this.updateMany({
      user: userId,
      isActive: true,
    }, {
      isActive: false,
    }, false);
  }

  async createForUser(data: any, userId: string) {
    const mealPlan = await this.mealPlansService.findOneOrFail({
      _id: data.meal_plan,
    });

    await this.unregisterCurrentMealPlan(userId);

    return await this.create({
      ...data,
      user: userId,
      days: mealPlan.days,
      isActive: true,
    });
  }
}
