import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { MealPlansService } from "../../meal-plans/services/meal-plans.service";
import { HttpError } from "@lib/error-handling/http-error";
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
      _id: data.mealPlan,
    });

    await this.unregisterCurrentMealPlan(userId);

    return await this.create({
      ...data,
      user: userId,
      days: mealPlan.days,
      isActive: true,
    });
  }
  async updateForUser(mealPlanProps: { urwId: string; dayNumber: number }, data: any, userId: string) {
    // find mealPlan
    
    const mealPlan = await this.findOneOrFail({
      _id: mealPlanProps.urwId,
      user: userId,
    });
    
    // find day
    const day = mealPlan.days.find(d => d.day_number === mealPlanProps.dayNumber);
    if (!day) throw new HttpError(404, 'Workout Day Not Found');
    const dayIndex = mealPlan.days.indexOf(day)

    // update day
    day.is_eaten = true;
    mealPlan.days[dayIndex] = day;

    // save changes
    mealPlan.markModified('days');

    const updatedMealPlan = await mealPlan.save();

    // check if it's the last day
    const lastDay = mealPlan.days[mealPlan.days.length - 1];
    if (lastDay.day_number === mealPlanProps.dayNumber) {
      console.log('This is the last day that was updated.');
    }

    return updatedMealPlan;
  }
}