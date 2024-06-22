import { ActivityType } from "@common/enums/activity-type.enum";
import { Activity, IActivity } from "@common/models/activity.model";
import { EventsManager } from "@lib/events/events-manager";
import { Types } from "mongoose";

export class ExerciseDoneEvent {
  constructor(public userId: string, public exercisesId: string){}
}

EventsManager.on(ExerciseDoneEvent.name, async (event: ExerciseDoneEvent) => {
  console.log(`Exercise done event for user ${event.userId}`);

  Activity.create({
    user_id: new Types.ObjectId(event.userId),
    related_id: new Types.ObjectId(event.exercisesId),
    activity_type: ActivityType.EXERCISE,
  } satisfies IActivity).catch(console.error);
});
