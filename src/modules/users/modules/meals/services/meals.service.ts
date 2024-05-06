import { Meal } from "@common/models/meal.model";
import { CrudService } from "@lib/services/crud.service";

export class MealsService extends CrudService(Meal) {}