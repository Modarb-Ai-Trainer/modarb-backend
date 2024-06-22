import { ExerciseType } from "@common/enums/exercise-type.enum";
import { Exercise, ExerciseDocument } from "@common/models/exercise.model";
import { CrudService } from "@lib/services/crud.service";

const caloriesPerMinute = 5;
const caloriesPerRep = 0.5;

export class ExerciseService extends CrudService(Exercise) {
  calculateCalories(exercise: ExerciseDocument): number {
    if (exercise.isDeleted) {
      return 0;
    }

    let calories = 0;

    switch (exercise.exerciseType) {
      case ExerciseType.DURATION:
        if (exercise.duration) {
        calories = exercise.duration * caloriesPerMinute;
      }
      break;

      case ExerciseType.WEIGHT:
        if (exercise.reps && exercise.sets) {
        calories = exercise.reps * exercise.sets * caloriesPerRep;
      }
      break;

      default:
        throw new Error(`Unknown exercise type: ${exercise.exerciseType}`);
    }

    return calories;
  }
}
