import { UserRegisteredWorkout } from "@common/models/user-registered-workout.model";
import { CrudService } from "@lib/services/crud.service";
import { ICreateUserRegisteredWorkouts } from "../validations/create-user-registered-workouts.validation";
import { WorkoutService } from "../../workouts/services/workouts.service";
import { IUpdateUserRegisteredWorkouts } from "../validations/update-user-registered-workouts.validation";
import { HttpError } from "@lib/error-handling/http-error";

export class UserRegisteredWorkoutsService extends CrudService(UserRegisteredWorkout) {
  private workoutsService: WorkoutService = new WorkoutService();
  
  async createForUser(data: ICreateUserRegisteredWorkouts, userId: string) {
    const workout = await this.workoutsService.findOneOrFail({
      _id: data.workout,
    });
    return await this.create({
      ...data,
      user: userId,
      weeks: workout.template_weeks,
      is_active: true,
    });
  }

  async updateForUser(workoutProps: {urwId: string; weekNumber: number; dayNumber: number}, data: IUpdateUserRegisteredWorkouts, userId: string) {
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
    
    // save changes
    workout.markModified('weeks');
    return workout.save()
  }
}
