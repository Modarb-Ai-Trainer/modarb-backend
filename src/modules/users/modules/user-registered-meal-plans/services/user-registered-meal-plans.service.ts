import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { MealPlansService } from "../../meal-plans/services/meal-plans.service";
import { HttpError } from "@lib/error-handling/http-error";


export class UserRegisteredMealPlansService extends CrudService(UserRegisteredMealPlan) {
  private mealPlansService: MealPlansService = new MealPlansService();

  async unregisterCurrentMealPlan(userId: string) {
    return await this.updateMany({
      user: userId,
      isActive: true,
    }, {
      isActive: false,
    });
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
    async updateForUser(mealPlanProps: {urwId: string; dayNumber: number}, data: any, userId: string) {
        // find workout
        const mealPlan = await this.findOneOrFail({
          _id: mealPlanProps.urwId,
          user: userId,
        });
    
    
        // find day
        const day = mealPlan.days.find(d => d.day_number === mealPlanProps.dayNumber);
        if(!day) throw new HttpError(404, 'Workout Day Not Found');
        const dayIndex = mealPlan.days.indexOf(day)
    
        // update day and week
        day.is_eaten = true;
        mealPlan.days[dayIndex] = day;
        
        // save changes
        mealPlan.markModified('days');
        return mealPlan.save()
      }
}