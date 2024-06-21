import { UserRegisteredWorkout } from "@common/models/user-registered-workout.model";
import { CrudService } from "@lib/services/crud.service";
import { ICreateUserRegisteredWorkouts } from "../validations/create-user-registered-workouts.validation";
import { Workout } from "@common/models/workout.model";

export class UserRegisteredWorkoutsService extends CrudService(UserRegisteredWorkout, {
  defaultFilter: {
    is_active: true,
  },
}) {
  private workoutsService = new (CrudService(Workout))()

  async unregisterCurrentWorkout(userId: string) {
    return await this.updateMany({
      user: userId,
      is_active: true,
    }, {
      is_active: false,
    }, false);
  }
  
  async createForUser(data: ICreateUserRegisteredWorkouts, userId: string) {
    const workout = await this.workoutsService.findOneOrFail({
      _id: data.workout,
    });

    await this.unregisterCurrentWorkout(userId); 

    return await this.create({
      ...data,
      user: userId,
      weeks: workout.template_weeks,
      is_active: true,
    });
  }
}
