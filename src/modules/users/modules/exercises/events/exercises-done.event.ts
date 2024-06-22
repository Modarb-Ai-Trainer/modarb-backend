import { ActivityType } from "@common/enums/activity-type.enum";
import { Activity, IActivity } from "@common/models/activity.model";
import { EventsManager } from "@lib/events/events-manager";
import { Types } from "mongoose";

export class ExercisesDoneEvent {
  constructor(public userId: string, public exercisesIds: string[]){}
}

EventsManager.on(ExercisesDoneEvent.name, async (event: ExercisesDoneEvent) => {
  console.log(`Exercise done event for user ${event.userId}`);

  await Promise.all(
    event.exercisesIds.map(eId => {
      Activity.create({
        user_id: new Types.ObjectId(event.userId),
        related_id: new Types.ObjectId(eId),
        activity_type: ActivityType.EXERCISE,
      } satisfies IActivity).catch(console.error);
    })
  )
});
