import { Muscle } from "@common/models/muscle.model";
import { CrudService } from "@lib/services/crud.service";

export class MusclesService extends CrudService(Muscle) {};
