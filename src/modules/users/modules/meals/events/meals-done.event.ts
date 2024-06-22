import { ActivityType } from "@common/enums/activity-type.enum";
import { Activity, IActivity } from "@common/models/activity.model";
import { EventsManager } from "@lib/events/events-manager";
import { Types } from "mongoose";

export class MealsDoneEvent {
  constructor(public userId: string, public mealsIds: string[]){}
}

EventsManager.on(MealsDoneEvent.name, async (event: MealsDoneEvent) => {
  console.log(`Meal done event for user ${event.userId}`);

  await Promise.all(
    event.mealsIds.map(mId => {
      Activity.create({
        user_id: new Types.ObjectId(event.userId),
        related_id: new Types.ObjectId(mId),
        activity_type: ActivityType.MEAL,
      } satisfies IActivity).catch(console.error);
    })
  )
});
