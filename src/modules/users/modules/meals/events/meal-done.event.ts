import { ActivityType } from "@common/enums/activity-type.enum";
import { Activity, IActivity } from "@common/models/activity.model";
import { EventsManager } from "@lib/events/events-manager";
import { Types } from "mongoose";

export class MealDoneEvent {
  constructor(public userId: string, public mealId: string){}
}

EventsManager.on(MealDoneEvent.name, async (event: MealDoneEvent) => {
  console.log(`Meal done event for user ${event.userId}`);

  Activity.create({
    user_id: new Types.ObjectId(event.userId),
    related_id: new Types.ObjectId(event.mealId),
    activity_type: ActivityType.MEAL,
  } satisfies IActivity).catch(console.error);
});
