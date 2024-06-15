import { ActivityType } from "@common/enums/activity-type.enum";
import { Activity, IActivity } from "@common/models/activity.model";
import { EventsManager } from "@lib/events/events-manager";
import { IEatCustomMeal } from "../validations/eat-custom-meal.validation";

export class EatCustomMealEvent {
  constructor(public userId: string, public ingredients: IEatCustomMeal['ingredients']) {}
}

EventsManager.on(ActivityType.EAT_CUSTOM_MEAL, (event: EatCustomMealEvent) => {
  console.log(`User with id ${event.userId} ate a custom meal with ingredients: ${event.ingredients.map(i => i.id).join(", ")}`);

  Activity.create({
    user_id: event.userId,
    activity_type: ActivityType.EAT_CUSTOM_MEAL,
    related_item: { ingredients: event.ingredients },
  } satisfies IActivity).catch(console.error);
});
