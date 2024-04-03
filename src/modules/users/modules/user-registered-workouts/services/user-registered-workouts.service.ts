import { UserRegisteredWorkout } from "@common/models/user-registered-workout.model";
import { CrudService } from "@lib/services/crud.service";

export class UserRegisteredWorkoutsService extends CrudService(UserRegisteredWorkout) {}
