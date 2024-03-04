import { Workout } from "@common/models/workout.model";
import { CrudService } from "@lib/services/crud.service";

export class WorkoutService extends CrudService(Workout) {}
