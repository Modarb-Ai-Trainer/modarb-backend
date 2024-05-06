import { UserRegisteredMealPlan } from "@common/models/user-registered-meal-plan.model";
import { CrudService } from "@lib/services/crud.service";

export class UserRegisteredMealPlansService extends CrudService(UserRegisteredMealPlan) {}