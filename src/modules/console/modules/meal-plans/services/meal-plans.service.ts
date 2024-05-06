import { MealPlan } from "@common/models/meal-plan.model";
import { CrudService } from "@lib/services/crud.service";

export class MealPlansService extends CrudService(MealPlan) {}