import { Exercise } from "@common/models/exercise.model";
import { CrudService } from "@lib/services/crud.service";

export class ExerciseService extends CrudService(Exercise) {}
