import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { CrudService } from "@lib/services/crud.service";
import { HttpError } from "@lib/error-handling/http-error";
import { MealPlansService } from "../../meal-plans/services/meal-plans.service";
import { EventsManager } from "@lib/events/events-manager";
import { MealsDoneEvent } from "../../meals/events/meals-done.event";

export class MealPlansProgressService extends CrudService(UserRegisteredMealPlan) {
  private mealPlansService = new MealPlansService()

  async updateForUser(mealPlanProps: { urwId: string; dayNumber: number }, _data: any, userId: string) {
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
      this.mealPlansService.createModelMealPlan(userId)
    }

    EventsManager.emit(MealsDoneEvent.name, new MealsDoneEvent(userId, day.meals.map(e => e.toString())));

    return updatedMealPlan;
  }
}
