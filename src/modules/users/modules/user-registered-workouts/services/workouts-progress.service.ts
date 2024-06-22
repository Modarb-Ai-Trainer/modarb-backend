import { UserRegisteredWorkout } from "@common/models/user-registered-workout.model";
import { CrudService } from "@lib/services/crud.service";
import { IUpdateUserRegisteredWorkouts } from "../validations/update-user-registered-workouts.validation";
import { HttpError } from "@lib/error-handling/http-error";
import { WorkoutService } from "../../workouts/services/workouts.service";
import { EventsManager } from "@lib/events/events-manager";
import { ExercisesDoneEvent } from "../../exercises/events/exercises-done.event";

export class WorkoutsProgressService extends CrudService(UserRegisteredWorkout, {
  defaultFilter: {
    is_active: true,
  },
}) {
  private workoutsService = new WorkoutService();

  async updateForUser(workoutProps: {urwId: string; weekNumber: number; dayNumber: number}, _data: IUpdateUserRegisteredWorkouts, userId: string) {
    // find workout
    const workout = await this.findOneOrFail({
      _id: workoutProps.urwId,
      user: userId,
    });

    // find week
    const week = workout.weeks.find(w => w.week_number === workoutProps.weekNumber);
    if(!week) throw new HttpError(404, 'Workout Week Not Found');
    const weekIndex = workout.weeks.indexOf(week);

    // find day
    const day = week.days.find(d => d.day_number === workoutProps.dayNumber);
    if(!day) throw new HttpError(404, 'Workout Day Not Found');
    const dayIndex = week.days.indexOf(day)

    // update day and week
    day.is_done = true;
    week.days[dayIndex] = day;
    week.is_done = week.days.every(d => d.is_done);
    workout.weeks[weekIndex] = week;

    // if last week
    if(weekIndex === workout.weeks.length - 1) {
      await this.workoutsService.createModelWorkout(userId)
    }

    EventsManager.emit(ExercisesDoneEvent.name, new ExercisesDoneEvent(userId, day.exercises.map(e => e.toString())));
    
    // save changes
    workout.markModified('weeks');
    return workout.save()
  }
}
